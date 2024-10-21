const Auth = require('../models/auth')
const User = require('../models/user')

const Token = require('../models/token')
const Controller = require('./base/controller.js')

const { hash, compare } = require('../config/encryptor')
const sharp = require('sharp')


class SignUp extends Controller {
    validFields     = ["username", "password", "email", "phone", "fullname"]
    constructor(){
        super()
    }

    post = async (req, res) => {
        /**
         * 
         * SIGN UP REQUEST
         * 
         * @body
         *  - username: <String>
         *  - password: <String>
         *  - fullname: <String>
         *  - phone   : <String>
         *  - email   : <String>
         * 
         * @desc
         *  Extract informations from request body then validate and create account => user profile => token
         *  If the chain is all success => Response user profile and token
         * 
         * @response
         * 
         * {
         *   success: true,
         *   data: {
         *       success: true,
         *       content: “User created”,
         *           token: “[ TOKEN ]”,
         *           code: “SU_AU102”,
         *           user:  {
         *               username: <String>,
         *               fullname: <String>,
         *               email: <String>,
         *               phone: <String>,
         *               avatar: <String>
         *           }
         *       }
         *   }
         *
         * 
         */


        const signUp = async () => {                        
            const data  = req.body
            
            const isBodyValid = this.validateReqBodyFields(data)   
            const nullCheck   = this.nullCheck(data, ["username", "password", "fullname"])                     
            if( !isBodyValid || !nullCheck ){
                this.throw400BadRequest("Wrong data format", "ER_UN101")
            }else{
                const { username } = data;
                const doesUserExist = await Auth.findOne({ where: { username } })                
                if( doesUserExist ){
                    /**
                     * If usename has already been used, set response content and code then response
                     */

                    this.throwResponse( false, 200, "Username already existed", "ER_UN102" )
                }else{
                    /**
                     * 
                     * Validate user profile data, if they all are valid, create account, userprofile 
                     * and a token as well
                     * 
                     */
                    const { username, password } = data 
                    const hashedPassword = await hash(password)
                    try{
                        
                        await Auth.create({ ...data, password: hashedPassword })
                        await User.create({ ...data, avatar:`/images/avatar/${username}.png` })
                        const token = await this.tokenSign( username )
                        
                        this.throwResponse(true, 200,"User created", "SU_AU102" )
                        this.response.data.user     = {
                            ...data,
                            password: undefined,
                            avatar: `/images/avatar/${username}.png`
                        }
                        this.response.data.token    = token

                    }catch(err){
                        Auth.destroy({ where: { username } })
                        User.destroy({ where: { username } })

                        this.throw400BadRequest()
                    }
                    
                }
            }
        }
        this.UnauthorizeRequestDecorator(req, res, signUp)
    }    
}

class SignIn extends Controller {
    validFields     = ["username", "password" ]
    constructor(){
        super()
    }

    post = async (req, res) => {
        /**
         * 
         * Sign in request
         * 
         */
        const SignIn = async () => {
            const data = req.body;
            const isBodyValid = this.validateReqBodyFields(data)
            if( !isBodyValid ){
                this.throw400BadRequest("Wrong data format", "ER_UN101")
            }else{
                const { username, password } = data;
                const account = await Auth.findOne({ where: { username } })                
                if( account ){
                    const accountData = account.dataValues;
                    const doPasswordsMatch = compare(password, accountData.password)

                    if( doPasswordsMatch ){
                        const userProfileQuery = await User.findOne({ where: { username } })
                        const userProfile      = userProfileQuery.dataValues

                        const tokenQuery = await Token.findOne({ where: { username } })
                        let token;
                        if( tokenQuery ){
                            token  = tokenQuery.dataValues.token
                        }else{
                            token = await this.tokenSign(username )
                        }                        
                        this.throwResponse( true, 200,  "Successfully signed in", "SU_AU103" )
                        this.response.data.token   = token 
                        this.response.data.user    = userProfile

                    }else{
                        this.throwSignFailedDueToWrongCredential()
                    }
                }else{
                    this.throwSignFailedDueToWrongCredential()
                }
            }
        }
        this.UnauthorizeRequestDecorator(req, res, SignIn)
    }
    throwSignFailedDueToWrongCredential = () => {    
        this.throwResponse( false, 200, "Signed in fail due to wrong information", "ER_AU104" )
    }
}

class Update extends Controller {
    validFields = ["phone", "email", "fullname"]
    constructor(){
        super()
    }

    put = async (req, res) => {
        const updateProfile = async ( username ) => {
            /**
             * 
             * Extract data from request body and update corresponse User instance
             * 
             */

            const data = req.body
            const isBodyValid = this.validateReqBodyFields(data)
            if( !isBodyValid ){
                this.throw400BadRequest()
            }else{    
                
                /**
                 * 
                 * Because i'm lazy to check datatype of EVERY SINGLE FIELD so I just use try-catch here for now -_-
                 * 
                 */
                try{
                    await User.update({...data},{ where: { username }})
                    this.throwResponse( true, 200, "User updated", "SU_AU101")
                }catch(err){
                    this.throw400BadRequest()
                }                
            }
        }
        this.AuthorizedRequestDecorator( req, res, updateProfile )
    }

    patch = async (req, res) => {        
        const patchAvatar = async ( username ) => {            
            const { image } = req.body;            
            if( !image ){
                this.throw400BadRequest()
            }else{
                const croppingResult = await this.cropImage(image, username)                
                if( croppingResult ){
                    this.throwResponse(true, 200, "User updated", "SU_AU101" )

                }else{
                    this.throw400BadRequest()
                }
            }
        }
        this.AuthorizedRequestDecorator( req, res, patchAvatar )
    }

    cropImage = async ( base64Image, username ) => {
        /**
         * 
         * Crop image and save it to user avatar folder
         * 
         * @params
         *  - base64Image: <Base64>
         *  - username   : <String>
         * 
         * @returns
         *  - success: <Bool>
         * 
         */
        let success = true
        try{            
            success = await new Promise((resolve, reject) => {
                /**
                 * Remove ;base64, header if exists
                 * And create buffer from it
                 */
                const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, ''); 
                const imageBuffer = Buffer.from(base64Data, 'base64');

                sharp(imageBuffer).metadata().then(({ width, height }) => {
                    const cropSize = Math.min( width, height )                   

                        return sharp(imageBuffer).extract({
                            left: Math.floor((width - cropSize) / 2), 
                            top: Math.floor((height - cropSize) / 2),
                            width: cropSize,
                            height: cropSize
                        })
                        .toFile(`public/images/avatar/${ username }.png`)
                        .then(() => { 
                            /**
                             * Successfully cropped
                             */
                            resolve(true) 
                        }).catch((err) => {
                            /**
                             * Error
                             */
                            resolve(false)
                        })
                    
                })
            })
            
        }catch(err){
            success = false
        }
        return success
    }
}

class SignOut extends Controller {
    constructor(){
        super()
    }
    post = async (req, res) => {
        const signOut = async (username) => {
            await this.tokenRevoke(username)
            this.throwResponse( true, 200, "Token roveked", "SU_AU104" )
        }
        this.AuthorizedRequestDecorator(req, res, signOut)
    }
}

module.exports = {
    SignUp: new SignUp(),
    SignIn: new SignIn(),
    Update: new Update(),
    SignOut: new SignOut()
}