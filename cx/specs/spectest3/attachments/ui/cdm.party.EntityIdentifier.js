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

        const typeItem = gridField(fid("identifierType"), 5, "Identifier Type",
            "BIC, LEI, MIC, REDID, COUNTRY_CODE or OTHER.");
        const identItem = gridField(fid("identifier"), 7, "Identifier",
            "For LEI, exactly 20 alphanumeric characters.");

        const rowGridId = root + "_row";
        const rowGrid = { id: rowGridId, jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2 },
            elements: { [typeItem.id]: typeItem, [identItem.id]: identItem } };

        const cardId = root + "_card";
        const card = { id: cardId, jsontype: "mui.box",
            props: { sx: { bgcolor: 'background.paper',
                           border: '1px solid', borderColor: 'divider',
                           borderLeft: '3px solid', borderLeftColor: 'primary.main',
                           borderRadius: 2, p: 2 } },
            elements: { [rowGrid.id]: rowGrid } };

        return { sx: { p: 1, minWidth: 320 },
                 elements: { [card.id]: card } };
    } };
})();