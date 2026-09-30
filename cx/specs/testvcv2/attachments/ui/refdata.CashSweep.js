(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    function section(sectionId, title, items) {
        const grid = sectionId + "_g";
        const t = { id: sectionId + "_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: title,
                     sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [t.id]: t,
            [grid]: { id: grid, jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };
        const basics = section(root + "_basics", "Cash Sweep", [
            gridField(fid("label"), 8, "Label"),
            gridField(fid("notes"), 4, "Notes"),
            gridField(fid("targetAccountId"), 6, "Target Account ID"),
            gridField(fid("sweepThreshold"), 3, "Sweep Threshold"),
            gridField(fid("frequency"), 3, "Frequency")
        ]);
        const els = {};
        els[basics.id] = basics;
        return { sx: { p: 2, maxWidth: 720, mx: "auto", minWidth: 320 }, elements: els };
    } };
})();