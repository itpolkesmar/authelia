import React from "react";

import { Box, Button, Theme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";

import SuccessIcon from "@components/SuccessIcon";
import { DashboardApps } from "@constants/constants";

const Authenticated = function () {
    const { t: translate } = useTranslation();

    const { classes } = useStyles();

    return (
        <Box id="authenticated-stage">
            <Box className={classes.iconContainer}>
                <SuccessIcon />
            </Box>
            <Typography>{translate("Authenticated")}</Typography>
            <Button className={classes.appButon} href={DashboardApps} variant="contained">
                Dashboard Apps
            </Button>
        </Box>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    iconContainer: {
        marginBottom: theme.spacing(2),
        flex: "0 0 100%",
    },
    appButon: {
        marginTop: theme.spacing(2),
    },
}));

export default Authenticated;
