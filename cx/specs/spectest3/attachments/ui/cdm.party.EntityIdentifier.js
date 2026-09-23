(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, icon, items) {
        const grid = sectionId + "_g";
        const headerId = sectionId + "_h";
        const iconId = sectionId + "_ic";
        const titleId = sectionId + "_t";
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [headerId]: { id: headerId, jsontype: "mui.stack",
                props: { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 0.5 } },
                elements: {
                    [iconId]: { id: iconId, jsontype: "mui.icon",
                        props: { children: icon, color: "primary", fontSize: "small" } },
                    [titleId]: { id: titleId, jsontype: "mui.typography",
                        props: { variant: "subtitle2", children: title,
                                 sx: { textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' } } }
                } },
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        const ident = section(root + "_id", "Identifier", "fingerprint", [
            gridField(fid("identifier"), 6, "Identifier", "The identifier value — for LEI, 20 alphanumeric characters."),
            gridField(fid("identifierType"), 6, "Identifier Type", "BIC, LEI, MIC, REDID, COUNTRY_CODE or OTHER.")
        ]);

        return { sx: { p: 2, minWidth: 360, maxWidth: 720, mx: 'auto' },
                 elements: { [ident.id]: ident } };
    } };
})();