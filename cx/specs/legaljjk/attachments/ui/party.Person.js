(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");

    function fieldCell(el, size) {
        return { id: el.id + "_gi", jsontype: "mui.grid", props: { size: size }, elements: { [el.id]: el } };
    }

    return { main: function () {
        const root = model.getId() + "_root";
        const fid = function (n) { return model.fieldNameToModelId(n); };

        // Header zone: monogram avatar + large title + quiet subtitle. No boxes.
        const avatarId = root + "_avatar";
        const avatar = { id: avatarId, jsontype: "mui.avatar",
            props: { children: "P" },
            sx: { bgcolor: "primary.main", color: "primary.contrastText", width: 48, height: 48, fontSize: "1.25rem", fontWeight: 600 } };
        const titleId = root + "_title";
        const title = { id: titleId, jsontype: "mui.typography",
            props: { variant: "h5", children: "Person",
                     sx: { textTransform: "none", fontWeight: 600, lineHeight: 1.2 } } };
        const subtitleId = root + "_subtitle";
        const subtitle = { id: subtitleId, jsontype: "mui.typography",
            props: { variant: "body2", children: "A person the business deals with.",
                     sx: { textTransform: "none", color: "text.secondary", mt: 0.25 } } };
        const headerTextId = root + "_headertext";
        const headerText = { id: headerTextId, jsontype: "mui.box",
            elements: { [titleId]: title, [subtitleId]: subtitle } };
        const headerId = root + "_header";
        const header = { id: headerId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 2 }, sx: { alignItems: "center", mb: 1.5 },
            elements: { [avatarId]: avatar, [headerTextId]: headerText } };

        const dividerId = root + "_divider";
        const divider = { id: dividerId, jsontype: "mui.divider", sx: { mb: 2.5 } };

        // Status quick-set buttons: HARDCODED — one button per lifecycle value of
        // the bean's declared status set (draft | active | retired, the value set
        // the entity descriptor carries), each with a literal label and a theme
        // colour slot. (mui.chip rendered blank in the preview; mui.button is the
        // reliable control.) Each button writes the real Status field via a
        // value-carrying dispatch, exactly as picking in the Status picker does —
        // pending the form's Save; a button never saves on its own.
        const statusFieldId = fid("status");
        const statusButtons = [
            { label: "Draft",   color: "primary",  value: "draft" },
            { label: "Active",  color: "success",  value: "active" },
            { label: "Retired", color: "warning",  value: "retired" }
        ];

        const nameEl = viewUtils.buildUIElement(fid("name"), { label: "Name", variant: "outlined" });
        const ageEl = viewUtils.buildUIElement(fid("age"), { label: "Age", variant: "outlined", helperText: "Whole years, 0\u2013150." });
        const statusEl = viewUtils.buildUIElement(statusFieldId, { label: "Status", variant: "outlined" });

        // Capture each grid cell first, then key by its own id.
        const nameCell = fieldCell(nameEl, 8);
        const ageCell = fieldCell(ageEl, 4);
        const statusCell = fieldCell(statusEl, 12);

        const gridId = root + "_grid";
        const grid = { id: gridId, jsontype: "mui.grid",
            props: { container: true, columns: 12, spacing: 2 },
            elements: {
                [nameCell.id]: nameCell,
                [ageCell.id]: ageCell,
                [statusCell.id]: statusCell
            } };

        const elements = { [headerId]: header, [dividerId]: divider };

        const stripId = root + "_statusstrip";
        const buttonsId = stripId + "_buttons";
        const buttons = {};
        for (let i = 0; i < statusButtons.length; i++) {
            const b = statusButtons[i];
            const btnId = stripId + "_btn" + i;
            buttons[btnId] = { id: btnId, jsontype: "mui.button",
                props: { children: b.label, variant: "outlined", color: b.color },
                disabled: readOnly.boolValue(),
                actions: viewUtils.actions(viewUtils.onClick([
                    viewUtils.triggerChange(statusFieldId,
                        { jsontype: "ui.displayableEnum", name: b.value.toUpperCase(), value: b.value, label: b.label })
                ])) };
        }
        const stripLabelId = stripId + "_label";
        const stripLabel = { id: stripLabelId, jsontype: "mui.typography",
            props: { variant: "subtitle2", children: "Status", sx: { mb: 0.5 } } };
        const buttonRow = { id: buttonsId, jsontype: "mui.stack",
            props: { direction: "row", spacing: 1 }, elements: buttons };
        const strip = { id: stripId, jsontype: "mui.box", sx: { mb: 2.5 },
            elements: { [stripLabelId]: stripLabel, [buttonsId]: buttonRow } };
        elements[stripId] = strip;

        elements[gridId] = grid;

        return { sx: { p: 3, minWidth: 320, maxWidth: 720, mx: "auto" }, elements: elements };
    } };
})();