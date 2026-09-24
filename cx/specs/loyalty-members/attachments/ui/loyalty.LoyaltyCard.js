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
        const gridId = root + "_g";
        const items = [
            gridField(fid("lastFour"), 4, "Last Four", "The last four digits of the card number."),
            gridField(fid("issuedDate"), 4, "Issued Date"),
            gridField(fid("cardType"), 4, "Card Type")
        ];
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { sx: { minWidth: 320 },
            elements: { [gridId]: { id: gridId, jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 2 }, elements: children } } };
    } };
})();