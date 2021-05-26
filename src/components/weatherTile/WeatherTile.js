import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFavoriteCitiesSelected } from "../navBar/navBarSlice";
import { deleteWeatherReport } from "../searchBar/searchBarSlice";
import { selectUser, selectUserFavoriteCities, fetchUserFavoriteCities } from "../loginSignup/loginSignupSlice";
import {
  pushFavoriteCityToFirebase,
  getCityDetails,
  getCityFirebaseID,
  deleteFavoriteCityFromFirebase,
} from "../../helpers/helpers";
import { EuiButton, EuiCard, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import "@elastic/eui/dist/eui_theme_amsterdam_light.css";

function WeatherTile(props) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const userFavoriteCities = useSelector(selectUserFavoriteCities);
  const areFavoriteCitiesSelected = useSelector(selectFavoriteCitiesSelected);

  const isFavorite = Object.values(userFavoriteCities).some((city) => city.label === props.report.municipio.NOMBRE);

  function handleStoreFavorite(report, user) {
    pushFavoriteCityToFirebase(report, user);
    dispatch(fetchUserFavoriteCities(user));
  }

  function handleDeleteFavorite(userFavoriteCities, report, user) {
    dispatch(deleteWeatherReport(getCityDetails(report)));
    deleteFavoriteCityFromFirebase(getCityFirebaseID(userFavoriteCities, report), user);
  }

  return (
    <EuiFlexItem key={props.index}>
      <EuiCard
        textAlign="left"
        title={props.report.municipio.NOMBRE}
        description={
          <>
            <div>Temperature: {`${props.report.temperatura_actual} ºC`}</div>
            <div>Rain probability: {`${props.report.lluvia} mm`}</div>
          </>
        }
        footer={
          <EuiFlexGroup justifyContent="center">
            <EuiFlexItem grow={false}>
              <EuiButton
                size="s"
                color={isFavorite && areFavoriteCitiesSelected ? "danger" : isFavorite ? "text" : "secondary"}
                disabled={user && isFavorite && areFavoriteCitiesSelected ? false : user && !isFavorite ? false : true}
                onClick={() =>
                  isFavorite && areFavoriteCitiesSelected
                    ? handleDeleteFavorite(userFavoriteCities, props.report, user)
                    : handleStoreFavorite(props.report, user)
                }
              >
                {isFavorite && areFavoriteCitiesSelected
                  ? "Delete from favorites"
                  : isFavorite
                  ? "Stored in favorites"
                  : "Add to favorites"}
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        }
      />
    </EuiFlexItem>
  );
}

export default WeatherTile;
