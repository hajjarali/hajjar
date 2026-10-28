(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");
    function gridField(id, size) {
        const el = viewUtils.buildUIElement(id);
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }
    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const idv = beanViewUtils.buildIdView(model.getId());

        const nameVal = model.getFieldValue("name");
        const title = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h5", children: nameVal ? String(nameVal) : "New legal entity", sx: { fontWeight: 700 } } };
        const leiVal = model.getFieldValue("lei");
        const sub = { id: root + "_sub", jsontype: "mui.typography",
            props: { variant: "body2", children: leiVal ? "LEI " + String(leiVal) : "No LEI yet", sx: { color: "text.secondary", textTransform: "none" } } };
        const titleCol = { id: root + "_tc", jsontype: "mui.stack", props: { spacing: 0.5 },
            elements: { [title.id]: title, [sub.id]: sub } };
        const header = { id: root + "_hdr", jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 } },
            elements: { [titleCol.id]: titleCol } };

        const grid = root + "_g";
        const fields = {};
        const f1 = gridField(fid("name"), 6);
        const f2 = gridField(fid("lei"), 3);
        const f3 = gridField(fid("status"), 3);
        fields[f1.id] = f1; fields[f2.id] = f2; fields[f3.id] = f3;
        const detailsTitle = { id: root + "_dt", jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Details",
                sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } };
        const detailsBox = { id: grid, jsontype: "mui.box",
            props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
            elements: { [grid + "_in"]: { id: grid + "_in", jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 2 }, elements: fields } } };
        const details = { id: root + "_d", jsontype: "mui.box", props: { sx: { mb: 2 } },
            elements: { [detailsTitle.id]: detailsTitle, [detailsBox.id]: detailsBox } };

        return { sx: { p: 2, maxWidth: 960, minWidth: 320, mx: "auto" },
            elements: { [idv.idRow.id]: idv.idRow, [header.id]: header, [details.id]: details } };
    } };
})();