import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrencyState {
  selectedCurrency: string;
}

const initialState: CurrencyState = {
  selectedCurrency: "",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<string>) {
      state.selectedCurrency = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
