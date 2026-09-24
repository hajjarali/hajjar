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

    function section(sectionId, title, items) {
        const inner = sectionId + "_in"; const children = {};
        for (const it of items) { children[it.id] = it; }
        return { id: sectionId, jsontype: "mui.box", props: { sx: { mb: 2 } }, elements: {
            [sectionId + "_t"]: { id: sectionId + "_t", jsontype: "mui.typography",
                props: { variant: "subtitle2", children: title,
                         sx: { textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", mb: 0.5 } } },
            [sectionId + "_b"]: { id: sectionId + "_b", jsontype: "mui.box",
                props: { sx: { border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 } },
                elements: { [inner]: { id: inner, jsontype: "mui.grid",
                    props: { container: true, columns: 12, spacing: 2 }, elements: children } } } } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        const name = section(root + "_name", "Name", [
            gridField(fid("honorific"), 3, "Honorific"),
            gridField(fid("firstName"), 5, "First Name"),
            gridField(fid("surname"), 4, "Surname"),
            gridField(fid("suffix"), 3, "Suffix")
        ]);
        const additionalNames = section(root + "_additional", "Additional Names", [
            embedItem(fid("middleName")),
            embedItem(fid("initial"))
        ]);
        const identifiers = section(root + "_identifiers", "Person Identifiers", [
            embedItem(fid("personId"))
        ]);
        const personal = section(root + "_personal", "Personal", [
            gridField(fid("dateOfBirth"), 6, "Date of Birth")
        ]);
        const contact = section(root + "_contact", "Contact Information", [
            embedItem(fid("contactInformation"))
        ]);
        const elements = {};
        elements[name.id] = name;
        elements[additionalNames.id] = additionalNames;
        elements[identifiers.id] = identifiers;
        elements[personal.id] = personal;
        elements[contact.id] = contact;
        return { sx: { p: 2, minWidth: 320, maxWidth: 720, mx: "auto" }, elements: elements };
    } };
})();