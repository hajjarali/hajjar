(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };

        // Google "G" logo — a self-contained inline SVG (own viewBox, plain paths;
        // the four brand fills are part of the artwork, which the ui.svg rule permits).
        const logoId = root + "_logo";
        const logo = { id: logoId, jsontype: "ui.svg",
            props: { sx: { width: 48, height: 48, mb: 2 },
                     svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>' } };
        const logoBoxId = root + "_logobox";
        const logoBox = { id: logoBoxId, jsontype: "mui.box",
            props: { sx: { display: 'flex', justifyContent: 'center' } },
            elements: { [logoId]: logo } };

        // "Email or username" — the identifier field, label above the input as in the mock.
        const identifier = viewUtils.buildUIElement(fid("identifier"),
            { label: "Email or username", variant: "outlined" });

        // "Password" — the PASSWORD view type renders masked and carries its own
        // latching reveal eye inside the field's right edge (the mock's toggle).
        const password = viewUtils.buildUIElement(fid("password"),
            { label: "Password", variant: "outlined" });

        // Each field in its own box with an explicit bottom margin — the vertical
        // rhythm of the mock does not rely on the stack's spacing prop.
        const identBoxId = root + "_identbox";
        const identBox = { id: identBoxId, jsontype: "mui.box",
            props: { sx: { mb: 3 } },
            elements: { [identifier.id]: identifier } };

        const passBoxId = root + "_passbox";
        const passBox = { id: passBoxId, jsontype: "mui.box",
            props: { sx: { mb: 1 } },
            elements: { [password.id]: password } };

        // LOGIN — the mock's full-width button. Literal colours are forbidden by the
        // layout rulebook; green is the theme's `success` slot. Saving itself is the
        // bean form's standard action row (platform-owned); this is chrome.
        const btnId = root + "_submit";
        const submit = { id: btnId, jsontype: "mui.button",
            disabled: readOnly.boolValue(),
            props: { variant: "contained", color: "success", children: "LOGIN",
                     sx: { width: '100%', mt: 3, py: 1.2, borderRadius: 2, fontWeight: 600 } } };

        // The white rounded card, centred on the grey page. The card hugs its
        // content: no forced minHeight and only a light vertical margin, so the
        // card ends just below LOGIN instead of leaving dead space under it.
        const cardId = root + "_card";
        const card = { id: cardId, jsontype: "mui.card",
            props: { sx: { maxWidth: 420, width: '100%', p: 3, borderRadius: 3, my: 2 } },
            elements: { [logoBoxId]: logoBox, [identBoxId]: identBox, [passBoxId]: passBox, [btnId]: submit } };

        const outerId = root + "_outer";
        const outer = { id: outerId, jsontype: "mui.box",
            props: { sx: { p: 2, display: 'flex', justifyContent: 'center',
                           bgcolor: 'background.default', minWidth: 320 } },
            elements: { [cardId]: card } };

        return { sx: {}, elements: { [outerId]: outer } };
    } };
})();