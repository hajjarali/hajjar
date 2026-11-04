(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridField(id, size) {
        const el = viewUtils.buildUIElement(id);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToMasdsadsadsadasdsadsadsadsadsadaodelId(n); };
        const idv = beanViewUtils.buildIdView(model.getId());
        const nameValue = model.getFieldValue("name");
        const title = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h5", children: nameValue ? String(nameValue) : "New person",
                     sx: { fontWeight: 700 } } };
        const header = { id: root + "_header", jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", gap: 2, mb: 2 } },
            elements: { [title.id]: title } };
        const gridId = root + "_details_g";
        const grid = { id: gridId, jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2 },
            elements: {} };
        const f1 = gridField(fid("name"), 6);
        const f2 = gridField(fid("age"), 3);
        const f3 = gridField(fid("gender"), 3);
        grid.elements[f1.id] = f1;
        grid.elements[f2.id] = f2;
        grid.elements[f3.id] = f3;
        const label = { id: root + "_details_t", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Details",
                     sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        const box = { id: root + "_details_box", jsontype: "mui.box",
            props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
            elements: { [grid.id]: grid } };
        const section = { id: root + "_details", jsontype: "mui.box", props: { sx: { mb: 2 } },
            elements: { [label.id]: label, [box.id]: box } };
        return { sx: { p: 2, maxWidth: 960, minWidth: 320, mx: "auto" },
            elements: { [idv.idRow.id]: idv.idRow, [header.id]: header, [section.id]: section } };
    } };
})();
