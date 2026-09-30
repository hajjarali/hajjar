(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    function gridField(fieldId, size, props) {
        const el = viewUtils.buildUIElement(fieldId, props);
        return { id: fieldId + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    function section(sectionId, title, items) {
        const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } },
            [sectionId + "_g"]: { id: sectionId + "_g", jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: { [sectionId + "_gin"]: { id: sectionId + "_gin", jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };
        const profile = section(root + "_profile", "Profile", [
            gridField(fid("name"), 6, { label: "Name", variant: "outlined" }),
            gridField(fid("channel"), 6, { label: "Channel", variant: "outlined" }),
            gridField(fid("description"), 12, { label: "Description", variant: "outlined" })
        ]);
        const artifactsEl = viewUtils.buildUIElement(fid("artifacts"), {});
        const artifacts = section(root + "_artifacts", "Artifacts", [
            { id: artifactsEl.id + "_gi", jsontype: "mui.grid", props: { size: 12 }, elements: { [artifactsEl.id]: artifactsEl } }
        ]);
        return { sx: { p: 2, maxWidth: 720, mx: "auto", minWidth: 320 }, elements: {
            [profile.id]: profile, [artifacts.id]: artifacts } };
    } };
})();