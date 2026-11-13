(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function wrap(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const idv = beanViewUtils.buildIdView(model.getId());
        const title = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h6", children: "Supplier", sx: { fontWeight: 700 } } };
        const header = { id: root + "_hdr", jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 } },
            elements: { [title.id]: title } };
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const activeEl = viewUtils.buildUIElement(model.fieldNameToModelId("active"));
        const emailEl = viewUtils.buildUIElement(model.fieldNameToModelId("contactEmail"));
        const countryEl = viewUtils.buildUIElement(model.fieldNameToModelId("country"));
        const nameG = wrap(nameEl, 6);
        const activeG = wrap(activeEl, 3);
        const emailG = wrap(emailEl, 6);
        const countryG = wrap(countryEl, 6);
        const grid = { id: root + "_grid", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2 },
            elements: { [nameG.id]: nameG, [activeG.id]: activeG, [emailG.id]: emailG, [countryG.id]: countryG } };
        const boxTitle = { id: root + "_dt", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Details",
                sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        const box = { id: root + "_box", jsontype: "mui.box",
            props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
            elements: { [grid.id]: grid } };
        const section = { id: root + "_sec", jsontype: "mui.box", props: { sx: { mb: 2 } },
            elements: { [boxTitle.id]: boxTitle, [box.id]: box } };
        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: "auto" },
            elements: { [idv.idRow.id]: idv.idRow, [header.id]: header, [section.id]: section } };
    } };
})();