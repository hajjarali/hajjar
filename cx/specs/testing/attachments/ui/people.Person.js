(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridField(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const idv = beanViewUtils.buildIdView(model.getId());
        const nameValue = model.getFieldValue("name");
        const title = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h5", children: nameValue ? String(nameValue) : "New person",
                     sx: { fontWeight: 700 } } };
        const header = { id: root + "_header", jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", gap: 2, mb: 2 } },
            elements: { [title.id]: title } };
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const ageEl = viewUtils.buildUIElement(model.fieldNameToModelId("age"));
        const genderEl = viewUtils.buildUIElement(model.fieldNameToModelId("gender"));
        const f1 = gridField(nameEl, 6);
        const f2 = gridField(ageEl, 3);
        const f3 = gridField(genderEl, 3);
        const grid = { id: root + "_details_g", jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2 },
            elements: { [f1.id]: f1, [f2.id]: f2, [f3.id]: f3 } };
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