import React from "react";
import { useTranslation } from "react-i18next";

export default function NoPage() {
    const { t, i18n } = useTranslation("global");

    return (
        <>
            <h1>{t("errors.pageNotFound")}</h1>
        </>
    );
}
