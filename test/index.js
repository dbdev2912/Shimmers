const { AuthTest } = require('./auth')

const Main = async () => {

    /** SIGN TEST */
    await AuthTest.test()

}

Main()