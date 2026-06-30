import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import SuccessIcon from "@components/SuccessIcon";
import { DashboardApps } from "@constants/constants";

const Authenticated = function () {
    const { t: translate } = useTranslation();

    return (
        <Box id="authenticated-stage">
            <Box sx={{ flex: "0 0 100%", marginBottom: (theme) => theme.spacing(2) }}>
                <SuccessIcon />
            </Box>
            <Typography>{translate("Authenticated")}</Typography>
            <Button sx={{ marginTop: (theme) => theme.spacing(2) }} href={DashboardApps} variant="contained">
                Dashboard Apps
            </Button>
        </Box>
    );
};

export default Authenticated;
