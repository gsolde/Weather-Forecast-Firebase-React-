import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {};
const citiesUrl = "https://www.el-tiempo.net/api/json/v2/municipios";

export const fetchCities = createAsyncThunk("availableCities/fetchCities", async () => {
  const res = await fetch(citiesUrl);
  const cities = await res.json();
  return cities;
});

export const appSlice = createSlice({
  name: "availableCities",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = "success";
        state.citiesList = action.payload;
        console.log("Cities fetched!");
      })
      .addCase(fetchCities.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectCities = (state) => state.citiesList;
export default appSlice.reducer;
