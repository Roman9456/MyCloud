const initialState = {
  user: null,
  files: [],
  users: [],
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
      // Set the current user in the state
      case 'SET_USER':
          return { ...state, user: action.payload };

      // Set the list of files
      case 'SET_FILES':
          return { ...state, files: action.payload };

      // Add a new file to the list of files
      case 'ADD_FILE':
          return { ...state, files: [...state.files, action.payload] };

      // Remove a file based on its ID
      case 'REMOVE_FILE':
          return { ...state, files: state.files.filter(file => file.id !== action.payload) };

      // Set the list of users
      case 'SET_USERS':
          return { ...state, users: action.payload };

      // Update the comment of a specific file
      case 'UPDATE_COMMENT_SUCCESS':
          return {
              ...state,
              files: state.files.map(file =>
                  file.id === action.payload.file.id ? { ...file, comment: action.payload.file.comment } : file
              ),
          };

      // Update the file name (original name) of a specific file
      case 'UPDATE_FILE_NAME_SUCCESS':
          return {
              ...state,
              files: state.files.map(file =>
                  file.id === action.payload.file.id ? { ...file, original_name: action.payload.file.original_name } : file
              ),
          };

      // Default case to return the current state if no action matches
      default:
          return state;
  }
};
