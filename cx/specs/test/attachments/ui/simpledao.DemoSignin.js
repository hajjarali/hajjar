(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };

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

        // SUBMIT — the mock's full-width button, blue (theme primary). Saving itself
        // is the bean form's standard action row (platform-owned); this is the chrome.
        const btnId = root + "_submit";
        const submit = { id: btnId, jsontype: "mui.button",
            disabled: readOnly.boolValue(),
            props: { variant: "contained", color: "primary", children: "SUBMIT",
                     sx: { width: '100%', mt: 3, py: 1.2, borderRadius: 2, fontWeight: 600 } } };

        // The white rounded card, centred on the grey page.
        const cardId = root + "_card";
        const card = { id: cardId, jsontype: "mui.card",
            props: { sx: { maxWidth: 420, width: '100%', p: 3, borderRadius: 3, my: 6 } },
            elements: { [identBoxId]: identBox, [passBoxId]: passBox, [btnId]: submit } };

        const outerId = root + "_outer";
        const outer = { id: outerId, jsontype: "mui.box",
            props: { sx: { p: 2, display: 'flex', justifyContent: 'center',
                           bgcolor: 'background.default', minHeight: 420, minWidth: 320 } },
            elements: { [cardId]: card } };

        return { sx: {}, elements: { [outerId]: outer } };
    } };
})();