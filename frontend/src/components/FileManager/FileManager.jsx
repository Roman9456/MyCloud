import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSort, FaPlus } from 'react-icons/fa';
import FileList from '../File/FileList/FileList';
import { logout, upload, loadFiles } from '../../redux/actions';
import logo from '../../assets/logo.jpg';
import userLogo from '../../assets/user.png';
import styles from './FileManager.module.css';

export const FileManager = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [comment, setComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [sortField, setSortField] = useState('original_name');
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isUploading, setIsUploading] = useState(false); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = localStorage.getItem('token');
    const sortOptions = {
        user: 'User',
        original_name: 'Name',
        size: 'Size',
        upload_date: 'Upload Date',
        last_download_date: 'Last Download Date',
        comment: 'Comment'
    };
    const sortModalRef = useRef();
    let searchTimeout;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const toggleProfileModal = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            setIsUploading(true); 
            dispatch(upload(selectedFile, comment, token))
                .then(() => {
                    dispatch(loadFiles(token));
                    setIsModalOpen(false);
                    setComment('');
                    setSelectedFile(null);
                })
                .catch((error) => {
                    setErrorMessage("File upload error: " + error.message);
                })
                .finally(() => {
                    setIsUploading(false); 
                });
        }
    };

    const clearErrorMessage = () => {
        setErrorMessage(null);
    };

    const handleSortChange = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
        setIsSortModalOpen(false);
    };

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const value = e.target.value;
            setSearchText(value);
        }, 500);
    };

    const handleSortButtonClick = (event) => {
        const button = event.currentTarget;
        const { top, left, height } = button.getBoundingClientRect();
        
        setIsSortModalOpen(true);

        setTimeout(() => {
            if (sortModalRef.current) {
                sortModalRef.current.style.top = `${top + height}px`;
                sortModalRef.current.style.left = `${left}px`;
            }
        }, 0);
    };

    const handleClickOutside = (event) => {
        if (sortModalRef.current && !sortModalRef.current.contains(event.target)) {
            setIsSortModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.dashboard}>
            {errorMessage && (
                <div className={styles.errorMessage} onClick={clearErrorMessage}>
                    {errorMessage}
                </div>
            )}
            <header className={styles.header}>
                <img src={logo} alt="MyCloud" className={styles.logo} />
                <div className={styles.actions}>
                    <input
                        type="text"
                        placeholder="Search files..."
                        className={styles.search}
                        onChange={handleSearchChange}
                    />
                    <button className={styles.sort} onClick={handleSortButtonClick}>
                        <FaSort />
                    </button>
                    <button
                        className={styles.add}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus />
                    </button>
                </div>
                <div 
                    className={styles.userIcon}
                    onMouseEnter={() => setIsDropdownVisible(true)}
                    onMouseLeave={() => setIsDropdownVisible(false)}
                >
                    <img
                        src={userLogo}
                        alt={user.username || 'Guest'}
                        className={styles.logo}
                    />
                    {isDropdownVisible && (
                        <div className={styles.dropdown}>
                            <button onClick={toggleProfileModal}>Profile</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </header>
            <main>
                <FileList searchText={searchText} sortField={sortField} sortOrder={sortOrder} />
            </main>
            {isProfileOpen && (
                <div className={styles.profileModal}>
                    <h2>User Profile</h2>
                    <p>Username: {user.username}</p>
                    <button onClick={() => setIsProfileOpen(false)}>Close</button>
                </div>
            )}
            {isModalOpen && (
                <div className={styles.modal}>
                    <h2>Upload File</h2>
                    <input type="file" onChange={handleFileChange} />
                    <input 
                        type="text" 
                        placeholder="Comment" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                    />
                    <button 
                        onClick={handleUpload} 
                        disabled={isUploading} 
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
            )}
            {isSortModalOpen && (
                <div className={styles.sortModal} ref={sortModalRef}>
                    <h3>Select sorting field</h3>
                    <ul>
                        {Object.keys(sortOptions).map(option => (
                            <li key={option} onClick={() => handleSortChange(option)}>
                                {sortOptions[option]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
