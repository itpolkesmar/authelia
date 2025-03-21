import React, { useCallback, useEffect, useState } from "react";

import { Theme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { makeStyles } from "tss-react/mui";

import { IndexRoute } from "@constants/Routes";
import { RedirectionURL } from "@constants/SearchParams";
import { useIsMountedRef } from "@hooks/Mounted";
import { useNotifications } from "@hooks/NotificationsContext";
import { useQueryParam } from "@hooks/QueryParam";
import { useRedirector } from "@hooks/Redirector";
import MinimalLayout from "@layouts/MinimalLayout";
import { signOut } from "@services/SignOut";

const SignOut = function () {
    const { t: translate } = useTranslation();
    const { classes } = useStyles();

    const mounted = useIsMountedRef();
    const { createErrorNotification } = useNotifications();
    const redirectionURL = useQueryParam(RedirectionURL);
    const redirector = useRedirector();
    const [timedOut, setTimedOut] = useState(false);
    const [safeRedirect, setSafeRedirect] = useState(false);

    const doSignOut = useCallback(async () => {
        try {
            const res = await signOut(redirectionURL);
            if (res !== undefined && res.safeTargetURL) {
                setSafeRedirect(true);
            }
            setTimeout(() => {
                if (!mounted) {
                    return;
                }
                setTimedOut(true);
            }, 2000);
        } catch (err) {
            console.error(err);
            createErrorNotification(translate("There was an issue signing out"));
        }
    }, [createErrorNotification, redirectionURL, setSafeRedirect, setTimedOut, mounted, translate]);

    useEffect(() => {
        doSignOut();
    }, [doSignOut]);

    if (timedOut) {
        if (redirectionURL && safeRedirect) {
            redirector(redirectionURL);
        } else {
            return <Navigate to={IndexRoute} />;
        }
    }

    return (
        <MinimalLayout title={translate("Sign out")}>
            <Typography className={classes.typo}>{translate("You're being signed out and redirected")}...</Typography>
        </MinimalLayout>
    );
};

export default SignOut;

const useStyles = makeStyles()((theme: Theme) => ({
    typo: {
        padding: theme.spacing(),
    },
}));
