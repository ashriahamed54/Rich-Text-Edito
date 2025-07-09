
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  content: string;
  isLoading: boolean;
  fontFamily: string;
}

const initialState: EditorState = {
  content: '',
  isLoading: false,
  fontFamily: 'Arial',
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload;
    },
  },
});

export const { setContent, setLoading, setFontFamily } = editorSlice.actions;
export default editorSlice.reducer;
