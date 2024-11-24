import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaCopy, FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { loadFiles, deleteFileAction, updateCommentAction, updateFileNameAction, upload } from '../../redux/actions';
import './Files.css';

const FileUploadAndList = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const files = useSelector((state) => state.files);

    const [searchText, setSearchText] = useState('');
    const [sortField, setSortField] = useState('upload_date');
    const [sortOrder, setSortOrder] = useState('asc');

    const [file, setFile] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [copyFileLink, setCopyFileLink] = useState(null);
    const [notificationPosition, setNotificationPosition] = useState({ top: 0, left: 0 });

    // Centralize token retrieval and check
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            dispatch(loadFiles(token));
        }
    }, [dispatch, token]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (file && user && token) {
            dispatch(upload(file, token));
            setFile(null);
        }
    };

    const handleDelete = (fileId) => {
        if (user && token) {
            dispatch(deleteFileAction(fileId, token));
        }
    };

    const openEditModal = (file) => {
        setSelectedFile(file);
        setNewComment(file.comment || ''); // Safely handle potential null/undefined comment
        setIsModalOpen(true);
    };

    const handleSaveComment = () => {
        if (selectedFile && token) {
            dispatch(updateCommentAction(selectedFile.id, newComment, token));
            setIsModalOpen(false);
            setSelectedFile(null);
            setNewComment('');
        }
    };

    const openRenameModal = (file) => {
        setSelectedFile(file);
        setNewFileName(file.original_name || ''); // Safely handle potential null/undefined file name
        setIsRenameModalOpen(true);
    };

    const handleSaveFileName = () => {
        if (selectedFile && token) {
            dispatch(updateFileNameAction(selectedFile.id, newFileName, token));
            setIsRenameModalOpen(false);
            setSelectedFile(null);
            setNewFileName('');
        }
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

    // Filter files based on searchText
    const filteredFiles = searchText ? files.filter(file => {
        return (
            (file.user && file.user.includes(searchText)) ||
            (file.original_name && file.original_name.includes(searchText)) ||
            (file.upload_date && new Date(file.upload_date).toLocaleString().includes(searchText)) ||
            (file.last_download_date && new Date(file.last_download_date).toLocaleString().includes(searchText)) ||
            (file.comment && file.comment.includes(searchText))
        );
    }) : files;

    // Sort files based on selected field and order
    const sortedFiles = [...filteredFiles].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortField] < b[sortField] ? -1 : 1;
        } else {
            return a[sortField] > b[sortField] ? -1 : 1;
        }
    });

    return (
        <div className="file-upload-and-list">
            {/* Search and Sort */}
            <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
            />
            <button onClick={() => setSortField('upload_date')}>Sort by Date</button>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>Toggle Sort Order</button>

            {/* File Upload */}
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit"><FaPlus /> Upload</button>
            </form>

            {/* File List */}
            <h2>My Files</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
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
                                <a href={file.file_path} target="_blank" rel="noopener noreferrer">
                                    {file.original_name}
                                </a>
                                <button onClick={() => openRenameModal(file)}>
                                    <FaEdit />
                                </button>
                            </td>
                            <td>{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                            <td>{new Date(file.upload_date).toLocaleString()}</td>
                            <td>{file.last_download_date ? new Date(file.last_download_date).toLocaleString() : '-'}</td>
                            <td>
                                <span>{file.comment}</span>
                                <button onClick={() => openEditModal(file)}>
                                    <FaEdit />
                                </button>
                            </td>
                            <td>
                                <button onClick={(event) => handleCopyLink(`http://127.0.0.1:8000/api/download/${file.special_link}`, event)}>
                                    <FaCopy />
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(file.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Copy Link Notification */}
            {copyFileLink && (
                <div className="notification" style={{ top: `${notificationPosition.top}px`, left: `${notificationPosition.left}px` }}>
                    {copyFileLink}
                </div>
            )}

            {/* Edit Comment Modal */}
            {isModalOpen && selectedFile && (
                <div className="modal">
                    <h2>Edit Comment</h2>
                    <p>Name: {selectedFile.original_name}</p>
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                    />
                    <div>
                        <button onClick={handleSaveComment}>Save</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Rename File Modal */}
            {isRenameModalOpen && selectedFile && (
                <div className="modal">
                    <h2>Rename File</h2>
                    <input 
                        type="text" 
                        value={newFileName} 
                        onChange={(e) => setNewFileName(e.target.value)} 
                    />
                    <div>
                        <button onClick={handleSaveFileName}>Save</button>
                        <button onClick={() => setIsRenameModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

FileUploadAndList.propTypes = {
    searchText: PropTypes.string,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string
};

export default FileUploadAndList;
