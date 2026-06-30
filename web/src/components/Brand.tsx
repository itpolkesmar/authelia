import { Fragment } from "react";

import { Divider, Link } from "@mui/material";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
// import { useTranslation } from "react-i18next";

import PrivacyPolicyLink from "@components/PrivacyPolicyLink";
// import { EncodedName, EncodedURL } from "@constants/constants";
import { getPrivacyPolicyEnabled } from "@utils/Configuration";

export interface Props {}

const Brand = function (_props: Props) {
    // const { t: translate } = useTranslation();

    const privacyEnabled = getPrivacyPolicyEnabled();

    return (
        <Grid container size={{ xs: 12 }} alignItems="center" justifyContent="center">
            <Grid size={{ xs: 12 }}>
                <Link
                    // href={atob(String.fromCharCode(...EncodedURL))}
                    href="https://it.poltekkes-smg.ac.id"
                    target="_blank"
                    underline="hover"
                    sx={{ color: grey[500], fontSize: "0.7rem" }}
                >
                    {/* {translate("Powered by {{authelia}}", { authelia: atob(String.fromCharCode(...EncodedName)) })} */}
                    <strong>Unit IT</strong> &middot; Poltekkes Kemenkes Semarang
                </Link>
            </Grid>
            {privacyEnabled ? (
                <Fragment>
                    <Divider orientation="vertical" flexItem variant="middle" />
                    <Grid size={{ xs: 4 }}>
                        <PrivacyPolicyLink sx={{ color: grey[500], fontSize: "0.7rem" }} />
                    </Grid>
                </Fragment>
            ) : null}
        </Grid>
    );
};

export default Brand;
