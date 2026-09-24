(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const gridId = root + "_g";
        const items = [
            gridField(fid("street"), 12, "Street"),
            gridField(fid("city"), 6, "City"),
            gridField(fid("country"), 6, "Country")
        ];
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { sx: { minWidth: 320 },
            elements: { [gridId]: { id: gridId, jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 2 }, elements: children } } };
    } };
})();