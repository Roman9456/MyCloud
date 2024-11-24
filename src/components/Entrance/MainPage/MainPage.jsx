import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSort, FaPlus } from 'react-icons/fa';
import ItemList from '../Item/ItemList/ItemList';
import { logout, upload, loadItems } from '../../redux/actions'; 
import logo from '../../assets/logo.jpg';
import userIcon from '../../assets/user.png'; 
import styles from './MainPage.css'; 

export const MainPage = () => {
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false); 
    const [errorNotification, setErrorNotification] = useState(null); 
    const [fileComment, setFileComment] = useState(''); 
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false); 
    const [chosenFile, setChosenFile] = useState(null); 
    const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);
    const [sortBy, setSortBy] = useState('original_name'); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [orderBy, setOrderBy] = useState('asc'); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user); 
    const token = localStorage.getItem('token');
    const sortCriteria = {
        user: 'User',
        original_name: 'Name',
        size: 'Size',
        upload_date: 'Upload Date',
        last_download_date: 'Last Download Date',
        comment: 'Comment'
    };
    const sortMenuRef = useRef();
    let searchTimer;

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/'); 
    };

    const toggleProfileModal = () => {
        setIsProfileVisible(!isProfileVisible);
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        if (file) {
            setChosenFile(file);
        }
    };

    const handleFileUpload = () => {
        if (chosenFile) {
            dispatch(upload(chosenFile, fileComment, token))
                .then(() => {
                    dispatch(loadItems(token)); 
                    setIsUploadModalVisible(false);
                    setFileComment('');
                    setChosenFile(null);
                })
                .catch((error) => {
                    setErrorNotification("Error uploading file: " + error.message); 
                });
        }
    };

    const clearError = () => {
        setErrorNotification(null); 
    };

    const handleSortOptionChange = (field) => {
        if (field === sortBy) {
            setOrderBy(orderBy === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setOrderBy('asc');
        }
        setIsSortOptionsVisible(false);
    };

    const handleSearchQueryChange = (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            const value = e.target.value;
            setSearchQuery(value);
        }, 500);
    };

    const handleSortButtonClick = (event) => {
        const button = event.currentTarget;
        const { top, left, height } = button.getBoundingClientRect();
        
        setIsSortOptionsVisible(true);

        setTimeout(() => {
            if (sortMenuRef.current) {
                sortMenuRef.current.style.top = `${top + height}px`;
                sortMenuRef.current.style.left = `${left}px`;
            }
        }, 0);
    };

    const handleClickOutsideSortMenu = (event) => {
        if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
            setIsSortOptionsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideSortMenu);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSortMenu);
        };
    }, []);

    return (
        <div className={styles.mainPage}>
            {errorNotification && (
                <div className={styles.errorNotification} onClick={clearError}>
                    {errorNotification}
                </div>
            )}
            <header className={styles.header}>
                <img src={logo} alt="MyCloud" className={styles.logo} />
                <div className={styles.actions}>
                    <input
                        type="text"
                        placeholder="Search files..."
                        className={styles.search}
                        onChange={handleSearchQueryChange}
                    />
                    <button className={styles.sort} onClick={handleSortButtonClick}>
                        <FaSort />
                    </button>
                    <button
                        className={styles.add}
                        onClick={() => setIsUploadModalVisible(true)}
                    >
                        <FaPlus />
                    </button>
                </div>
                <div 
                    className={styles.userIcon}
                    onMouseEnter={() => setIsMenuVisible(true)}
                    onMouseLeave={() => setIsMenuVisible(false)}
                >
                    <img
                        src={userIcon}
                        alt={currentUser.username || 'Guest'}
                        className={styles.logo}
                    />
                    {isMenuVisible && (
                        <div className={styles.menu}>
                            <button onClick={toggleProfileModal}>Profile</button>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </div>
                    )}
                </div>
            </header>
            <main>
                <ItemList searchQuery={searchQuery} sortBy={sortBy} orderBy={orderBy}/> {}
            </main>
            {isProfileVisible && (
                <div className={styles.profileModal}>
                    <h2>User Profile</h2>
                    <p>Username: {currentUser.username}</p>
                    <button onClick={() => setIsProfileVisible(false)}>Close</button>
                </div>
            )}
            {isUploadModalVisible && (
                <div className={styles.uploadModal}>
                    <h2>Upload File</h2>
                    <input type="file" onChange={handleFileSelection} />
                    <input 
                        type="text" 
                        placeholder="Comment" 
                        value={fileComment} 
                        onChange={(e) => setFileComment(e.target.value)} 
                    />
                    <button onClick={handleFileUpload}>Submit</button>
                    <button onClick={() => setIsUploadModalVisible(false)}>Cancel</button>
                </div>
            )}
            {isSortOptionsVisible && (
                <div className={styles.sortOptions} ref={sortMenuRef}>
                    <h3>Select Sort Field</h3>
                    <ul>
                        {Object.keys(sortCriteria).map(option => (
                            <li key={option} onClick={() => handleSortOptionChange(option)}>
                                {sortCriteria[option]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
