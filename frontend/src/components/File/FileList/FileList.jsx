import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { loadFiles, deleteFileAction, updateCommentAction, updateFileNameAction } from '../../../redux/actions';
import styles from './FileList.module.css';
import { FaEdit, FaCopy } from 'react-icons/fa';

const FileList = ({ searchText, sortField, sortOrder }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const files = useSelector((state) => state.files);
    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [copyFileLink, setCopyFileLink] = useState(null);
    const [notificationPosition, setNotificationPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(loadFiles(token));
        }
    }, [dispatch]);

    const handleDelete = (fileId) => {
        const token = localStorage.getItem('token');
        if (user && token) {
            dispatch(deleteFileAction(fileId, token));
        }
    };

    const openEditModal = (file) => {
        setSelectedFile(file);
        setNewComment(file.comment);
        setIsModalOpen(true);
    };

    const handleSaveComment = () => {
        const token = localStorage.getItem('token');
        dispatch(updateCommentAction(selectedFile.id, newComment, token));
        setIsModalOpen(false);
        setSelectedFile(null);
        setNewComment('');
    };

    const openRenameModal = (file) => {
        setSelectedFile(file);
        setNewFileName(file.original_name);
        setIsRenameModalOpen(true);
    };

    const handleSaveFileName = () => {
        const token = localStorage.getItem('token');
        dispatch(updateFileNameAction(selectedFile.id, newFileName, token));
        setIsRenameModalOpen(false);
        setSelectedFile(null);
        setNewFileName('');
    };

    const showInfo = (message) => {
        setCopyFileLink(message);
        setTimeout(() => {
            setCopyFileLink(null);
        }, 3000);
    };

    const handleCopyLink = (link, event) => {
        navigator.clipboard.writeText(link);
        showInfo("Link copied to clipboard!");

        const buttonRect = event.target.getBoundingClientRect();
        setNotificationPosition({
            top: buttonRect.bottom + window.scrollY + 15,
            left: buttonRect.left + window.scrollX - 130
        });
    };

    const filteredFiles = searchText ? files.filter(file => {
        return (
            (file.user && file.user.includes(searchText)) ||
            (file.original_name && file.original_name.includes(searchText)) ||
            (file.upload_date && new Date(file.upload_date).toLocaleString().includes(searchText)) ||
            (file.last_download_date && new Date(file.last_download_date).toLocaleString().includes(searchText)) ||
            (file.comment && file.comment.includes(searchText))
        );
    }) : files;

    const sortedFiles = [...filteredFiles].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortField] < b[sortField] ? -1 : 1;
        } else {
            return a[sortField] > b[sortField] ? -1 : 1;
        }
    });

    return (
        <div className={styles["file-list"]}>
            <h2 className={styles.title}>My Files</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Size</th>
                        <th>Upload Date</th>
                        <th>Last Download Date</th>
                        <th>Comment</th>
                        <th>Special Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedFiles.map((file) => (
                        <tr key={file.id}>
                            <td>
                                <div className={styles['cell-content']}>
                                    <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                                        {file.original_name}
                                    </a>
                                    <button onClick={() => openRenameModal(file)} className={styles.iconButton}>
                                        <FaEdit />
                                    </button>
                                </div>
                            </td>
                            <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                            <td>{new Date(file.upload_date).toLocaleString()}</td>
                            <td>{file.last_download_date ? new Date(file.last_download_date).toLocaleString() : '-'}</td>
                            <td>
                                <div className={styles['cell-content']}>
                                    <span>{file.comment}</span>
                                    <button onClick={() => openEditModal(file)} className={styles.iconButton}>
                                        <FaEdit />
                                    </button>
                                </div>
                            </td>
                            <td>
                                <button onClick={(e) => handleCopyLink(`http://127.0.0.1:8000/api/download/${file.special_link}`, e)} className={styles.iconButton}>
                                    <FaCopy />
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(file.id)} className={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {copyFileLink && (
                <div 
                    className={`${styles['info-message']} ${copyFileLink ? styles.show : ''}`}
                    style={{ top: `${notificationPosition.top}px`, left: `${notificationPosition.left}px` }}
                >
                    {copyFileLink}
                </div>
            )}
            {isModalOpen && selectedFile && (
                <div className={styles.modal}>
                    <h2>Edit Comment</h2>
                    <p>Title: {selectedFile.original_name}</p>
                    <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Upload Date: {new Date(selectedFile.upload_date).toLocaleString()}</p>
                    <p>Comment:</p>
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                    />
                    <div className={styles.modalActions}>
                        <button onClick={handleSaveComment}>Save</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {isRenameModalOpen && selectedFile && (
                <div className={styles.modal}>
                    <h2>Rename File</h2>
                    <p>Current Name: {selectedFile.original_name}</p>
                    <input 
                        type="text" 
                        value={newFileName} 
                        onChange={(e) => setNewFileName(e.target.value)} 
                    />
                    <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Upload Date: {new Date(selectedFile.upload_date).toLocaleString()}</p>
                    <p>Comment: {selectedFile.comment}</p>
                    <div className={styles.modalActions}>
                        <button onClick={handleSaveFileName}>Save</button>
                        <button onClick={() => setIsRenameModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

FileList.propTypes = {
    searchText: PropTypes.string.isRequired,
    sortField: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired
};

export default FileList;
