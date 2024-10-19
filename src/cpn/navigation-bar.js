import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


/* eslint-disable jsx-a11y/anchor-is-valid */
const NavigationBar = (props) => {
    /**
     * 
     * Left side navigation bar
     * 
     */
    const navbarStructure = [
        {
            id: 0,
            title: null,
            items: [
                { id: 0, icon: 'cat-2.png', hoverColor: "#fac9de", title: 'Tất cả', url: '/' },
                { id: 1, icon: 'cat-1.png', hoverColor: "#cab6db", title: 'Hôm nay', url: '/' },
                { id: 2, icon: 'cat-3.png', hoverColor: "#f7b1cd", title: 'Ngày mai', url: '/' },
                { id: 3, icon: 'cat-4.png', hoverColor: "#c2dffd", title: 'Ngày mai', url: '/' },
            ]
        },
        {
            id: 1,
            title: "Danh mục",
            items: [
                { id: 0, icon: 'cat-2.png', hoverColor: "#fac9de", title: 'Nhắc nhở', url: '/section/reminders' },
                { id: 1, icon: 'cat-1.png', hoverColor: "#cab6db", title: 'Học tập', url: '/' },
                { id: 2, icon: 'cat-3.png', hoverColor: "#f7b1cd", title: 'Xem', url: '/' },
            ]
        },
        {
            id: 2,
            endMost: true,
            title: null,
            items: [
                { id: 0, icon: 'cat-2.png', hoverColor: "#fac9de", title: 'Hoàn thành', url: '/' },
                { id: 1, icon: 'cat-1.png', hoverColor: "#cab6db", title: 'Thùng rác', url: '/' },
                { id: 2, icon: 'cat-3.png', hoverColor: "#f7b1cd", title: 'Thống kê', url: '/' },
            ]
        }
    ]

    return (
        <div className="navbar">
            {navbarStructure.map(list =>
                <div key={ list.id } className={`nav-list ${ list.endMost ? "nav-list-bottom": "" }`}>
                    {list.title &&
                        <div className="nav-list-title">
                            <span>{list.title}</span>
                        </div>
                    }
                    {list.items.map(item =>
                        <NavLink key={item.id} data={item} />
                    )}

                </div>
            )}
        </div>
    )
}

const NavLink = (props) => {
    /**
     * 
     * Navigation bar custom Link component that behaves weird ways.
     *
     * The hover will use the icon background color for hover color
     * It cannot be created by normal hmtl css logic so we have to
     * do it from scratch 
     * 
     */
    const { data } = props;
    const { icon, url, title, hoverColor } = data;    
    const [ hover, setHover ] = useState(0);

    const navigator = useNavigate()

    return (
        <div className={`nav-item ${ hover ? 'nav-item-hover': '' }`}
            onMouseEnter={ (e) => { setHover(1) } } 
            onMouseLeave={ (e) => { setHover(0) } }
            style = { hover ? { backgroundColor: hoverColor }: {} }
            >
            <div className="nav-item-icon">
                <img alt="" src={`/icons/${icon}`} />
            </div>
            <div className="nav-link">
                <a onClick={ () => { navigator(url)  } } href="">{title}</a>
            </div>
        </div>
    )
} 

export default NavigationBar