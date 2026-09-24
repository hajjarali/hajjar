(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function gridField(id, size, label) {
        const el = viewUtils.buildUIElement(id, { label: label, variant: "outlined" });
        return { id: id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = (n) => model.fieldNameToModelId(n);
        // One row — name, email, role side by side — so an entry in the parent's
        // contacts list reads as one table row.
        const name = gridField(fid("fullName"), 4, "Full Name");
        const email = gridField(fid("email"), 5, "Email");
        const role = gridField(fid("role"), 3, "Role");
        const gridId = root + "_g";
        return { sx: { p: 0.5 }, elements: {
            [gridId]: { id: gridId, jsontype: "mui.grid",
                props: { container: true, columns: 12, spacing: 1.5 },
                elements: {
                    [name.id]: name,
                    [email.id]: email,
                    [role.id]: role
                } }
        } };
    } };
})();