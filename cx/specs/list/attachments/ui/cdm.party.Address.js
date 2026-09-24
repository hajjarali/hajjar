(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function embedItem(fieldId) {
        const el = viewUtils.buildUIElement(fieldId);
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: 12 }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const inner = root + "_in";
        const grid = { id: inner, jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2 }, elements: {
                [fid("street") + "_gi"]: embedItem(fid("street")),
                [fid("city") + "_gi"]: gridField(fid("city"), 6, "City"),
                [fid("state") + "_gi"]: gridField(fid("state"), 6, "State"),
                [fid("country") + "_gi"]: gridField(fid("country"), 6, "Country"),
                [fid("postalCode") + "_gi"]: gridField(fid("postalCode"), 6, "Postal Code")
            } };
        return { sx: { p: 2, minWidth: 320 }, elements: { [inner]: grid } };
    } };
})();