(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const inner = root + "_in";
        const grid = { id: inner, jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2 }, elements: {
                [fid("telephoneNumberType") + "_gi"]: gridField(fid("telephoneNumberType"), 5, "Number Type"),
                [fid("number") + "_gi"]: gridField(fid("number"), 7, "Number")
            } };
        return { sx: { p: 2, minWidth: 320 }, elements: { [inner]: grid } };
    } };
})();