(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label, helper) {
        const props = { label: label, variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(id, props);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);

        const typeItem = gridField(fid("identifierType"), 4, "Identifier Type",
            "BIC, LEI, MIC, REDID, COUNTRY_CODE or OTHER.");
        const identItem = gridField(fid("identifier"), 8, "Identifier",
            "The identifier value — for LEI, 20 alphanumeric characters.");

        const fieldsGridId = root + "_fields";
        const fieldsGrid = { id: fieldsGridId, jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2 },
            elements: { [typeItem.id]: typeItem, [identItem.id]: identItem } };

        return { sx: { p: 1, minWidth: 320 },
                 elements: { [fieldsGrid.id]: fieldsGrid } };
    } };
})();