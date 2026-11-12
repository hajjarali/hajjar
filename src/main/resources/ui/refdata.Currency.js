(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridItem(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const idv = beanViewUtils.buildIdView(model.getId());
        const title = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h5", children: "Currency", sx: { fontWeight: 700 } } };
        const sub = { id: root + "_sub", jsontype: "mui.typography",
            props: { variant: "body2", children: "Exchange rate of one unit to USD, used by convert.", sx: { color: "text.secondary", textTransform: "none", mb: 2 } } };
        const header = { id: root + "_head", jsontype: "mui.box", props: { sx: { mb: 1 } },
            elements: { [title.id]: title, [sub.id]: sub } };
        const codeEl = viewUtils.buildUIElement(model.fieldNameToModelId("code"));
        const nameEl = viewUtils.buildUIElement(model.fieldNameToModelId("name"));
        const rateEl = viewUtils.buildUIElement(model.fieldNameToModelId("rateToUsd"));
        const g1 = gridItem(codeEl, 3);
        const g2 = gridItem(nameEl, 6);
        const g3 = gridItem(rateEl, 3);
        const grid = { id: root + "_grid", jsontype: "mui.grid", props: { container: true, columns: 12, spacing: 2 },
            elements: { [g1.id]: g1, [g2.id]: g2, [g3.id]: g3 } };
        const label = { id: root + "_dl", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Details",
                sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        const box = { id: root + "_box", jsontype: "mui.box",
            props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
            elements: { [grid.id]: grid } };
        const section = { id: root + "_sec", jsontype: "mui.box", elements: { [label.id]: label, [box.id]: box } };
        return { sx: { p: 2, maxWidth: 720, minWidth: 320, mx: "auto" },
            elements: { [idv.idRow.id]: idv.idRow, [header.id]: header, [section.id]: section } };
    } };
})();
