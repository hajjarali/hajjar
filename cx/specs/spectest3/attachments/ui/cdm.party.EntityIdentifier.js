(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function fieldItem(fieldId, helper) {
        const props = { variant: "outlined" };
        if (helper) { props.helperText = helper; }
        const el = viewUtils.buildUIElement(fieldId, props);
        const wrapId = fieldId + "_gi";
        return { id: wrapId, jsontype: "mui.grid", props: { size: 12 }, elements: { [el.id]: el } };
    }

    function emblem(parentId) {
        const wrapId = parentId + "_emblem";
        const svgId = wrapId + "_svg";
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="color:currentColor">'
            + '<circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="2.5"/>'
            + '<path d="M24 7 L38 15.5 L38 32.5 L24 41 L10 32.5 L10 15.5 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.55"/>'
            + '<text x="24" y="29" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="700" fill="currentColor">CDM</text>'
            + '</svg>';
        return { id: wrapId, jsontype: "mui.box",
            props: { sx: { display: 'flex', justifyContent: 'center', mb: 1, color: 'primary.main' } },
            elements: { [svgId]: { id: svgId, jsontype: "ui.svg",
                props: { svg: svg, sx: { width: 56, height: 56 } } } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";

        const cardId = root + "_card";
        const stackId = cardId + "_stack";
        const emb = emblem(root);

        const identItem = fieldItem(model.fieldNameToModelId("identifier"),
            "The identifier value — for LEI, 20 alphanumeric characters.");
        const typeItem = fieldItem(model.fieldNameToModelId("identifierType"),
            "BIC, LEI, MIC, REDID, COUNTRY_CODE or OTHER.");

        const btnId = root + "_submit";
        const submitBtn = { id: btnId, jsontype: "mui.button",
            hidden: readOnly.boolValue(),
            props: { variant: "contained", color: "primary", children: "SUBMIT", fullWidth: true,
                     sx: { mt: 1, py: 1.2, borderRadius: 2, fontWeight: 600, fontSize: '0.95rem' } } };

        const fieldsGridId = stackId + "_fields";
        const fieldsGrid = { id: fieldsGridId, jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2.5 },
            elements: { [identItem.id]: identItem, [typeItem.id]: typeItem } };

        const card = { id: cardId, jsontype: "mui.paper",
            props: { elevation: 4, sx: { borderRadius: 3, p: 3, width: '100%', maxWidth: 420, mx: 'auto', my: 3 } },
            elements: { [stackId]: { id: stackId, jsontype: "mui.stack",
                props: { direction: "column", spacing: 2, alignItems: 'stretch' },
                elements: {
                    [emb.id]: emb,
                    [fieldsGrid.id]: fieldsGrid,
                    [btnId]: submitBtn
                } } } };

        return { sx: { p: 2, display: 'flex', justifyContent: 'center' },
                 elements: { [card.id]: card } };
    } };
})();