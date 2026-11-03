(function () {
    const viewUtils = require("cyai/uiai/elements/ViewUtils");
    const beanViewUtils = require("cyai/beans/view/BeanViewUtils");

    function rowShell(rowId, label, contentEls) {
        const labelEl = { id: rowId + "_l", jsontype: "mui.typography",
            props: { variant: "body2", children: label, sx: { color: "text.secondary", width: 160, flexShrink: 0, textTransform: "none", pt: 1 } } };
        const valueBox = { id: rowId + "_v", jsontype: "mui.box",
            props: { sx: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 2 } }, elements: {} };
        for (let i = 0; i < contentEls.length; i++) { valueBox.elements[contentEls[i].id] = contentEls[i]; }
        return { id: rowId, jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "flex-start", gap: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" } },
            elements: { [labelEl.id]: labelEl, [valueBox.id]: valueBox } };
    }
    function detailRow(rowId, label, field) {
        const wrap = { id: rowId + "_w", jsontype: "mui.box", props: { sx: { flex: 1, minWidth: 0 } }, elements: { [field.id]: field } };
        return rowShell(rowId, label, [wrap]);
    }
    function fmtDay(v) {
        if (v === null || v === undefined) { return ""; }
        const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(v));
        if (!m) { return String(v); }
        const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return days[d.getUTCDay()] + " " + Number(m[3]) + " " + months[Number(m[2]) - 1];
    }
    function fmtTime(v) {
        if (v === null || v === undefined) { return ""; }
        const m = /T(\d{2}):(\d{2})/.exec(String(v));
        return m ? (m[1] + ":" + m[2]) : "";
    }
    function statusText(v) {
        if (v === null || v === undefined) { return ""; }
        if (typeof v === "string") { return v; }
        if (v.getValue) { return String(v.getValue()); }
        return String(v);
    }

    return { main: function () {
        const root = model.getId() + "_root";

        const titleVal = model.getFieldValue("title");
        const startVal = model.getFieldValue("startTime");
        const endVal = model.getFieldValue("endTime");
        const status = statusText(model.getFieldValue("status"));
        const title = (titleVal === null || titleVal === undefined || String(titleVal) === "") ? "New booking" : String(titleVal);

        let range = "";
        if (startVal && endVal) {
            range = fmtDay(startVal) + ", " + fmtTime(startVal) + " \u2192 " + fmtTime(endVal);
        }

        const titleEl = { id: root + "_title", jsontype: "mui.typography",
            props: { variant: "h4", children: title, sx: { fontWeight: 700, textTransform: "none" } } };
        const tagColor = status === "confirmed" ? "success" : (status === "cancelled" ? "default" : "warning");
        const tagEl = { id: root + "_tag", jsontype: "mui.chip",
            props: { label: status === "" ? "requested" : status, size: "small", color: tagColor, sx: { textTransform: "none" } } };
        const titleRow = { id: root + "_titlerow", jsontype: "mui.box",
            props: { sx: { display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" } },
            elements: { [titleEl.id]: titleEl, [tagEl.id]: tagEl } };
        const subEl = { id: root + "_sub", jsontype: "mui.typography",
            props: { variant: "body1", children: range, sx: { color: "text.secondary", textTransform: "none" } } };
        const header = { id: root + "_header", jsontype: "mui.box", props: { sx: { mb: 3 } },
            elements: { [titleRow.id]: titleRow, [subEl.id]: subEl } };

        // Room: label as an openable link; the field's hidden mount stays in the row
        const roomMount = viewUtils.buildUIElement(model.fieldNameToModelId("room"));
        const hasRoom = room.getRefIdValue() !== null && room.getRefIdValue() !== undefined;
        const roomLink = { id: root + "_roomlink", jsontype: "mui.link",
            props: { children: hasRoom ? String(room.getEntityLabelValue()) + " #" + String(room.getRefIdValue()) : "No room selected",
                     underline: "hover", sx: { cursor: "pointer", textTransform: "none" } },
            actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(room.fieldNameToModelId("viewButton")) ])) };
        const roomPick = { id: root + "_roompick", jsontype: "mui.button", disabled: readOnly.boolValue(),
            props: { children: "Choose room", size: "small", variant: "text", sx: { flexShrink: 0, whiteSpace: "nowrap" } },
            actions: viewUtils.actions(viewUtils.onClick([ viewUtils.click(room.fieldNameToModelId("searchButton")) ])) };
        const roomRow = rowShell(root + "_r_room", "Room", [roomLink, roomPick, roomMount]);

        // Time as one range: start -> end
        const startEl = viewUtils.buildUIElement(model.fieldNameToModelId("startTime"));
        const startBox = { id: root + "_st", jsontype: "mui.box", props: { sx: { flex: 1, minWidth: 0 } }, elements: { [startEl.id]: startEl } };
        const arrow = { id: root + "_arrow", jsontype: "mui.typography",
            props: { variant: "h6", children: "\u2192", sx: { color: "text.secondary", flexShrink: 0 } } };
        const endEl = viewUtils.buildUIElement(model.fieldNameToModelId("endTime"));
        const endBox = { id: root + "_en", jsontype: "mui.box", props: { sx: { flex: 1, minWidth: 0 } }, elements: { [endEl.id]: endEl } };
        const timeRow = rowShell(root + "_r_time", "Time", [startBox, arrow, endBox]);

        const titleField = viewUtils.buildUIElement(model.fieldNameToModelId("title"));
        const attField = viewUtils.buildUIElement(model.fieldNameToModelId("attendees"));
        const orgField = viewUtils.buildUIElement(model.fieldNameToModelId("organiserEmail"));
        const statusField = viewUtils.buildUIElement(model.fieldNameToModelId("status"));

        const rows = { id: root + "_rows", jsontype: "mui.box", props: { sx: { borderTop: "1px solid", borderColor: "divider" } }, elements: {} };
        const list = [
            detailRow(root + "_r_title", "Title", titleField),
            roomRow,
            timeRow,
            detailRow(root + "_r_att", "Attendees", attField),
            detailRow(root + "_r_org", "Organiser", orgField),
            detailRow(root + "_r_status", "Status", statusField)
        ];
        for (let i = 0; i < list.length; i++) { rows.elements[list[i].id] = list[i]; }

        return { sx: { p: 4, maxWidth: 720, minWidth: 320, mx: "auto" },
            elements: { [header.id]: header, [rows.id]: rows } };
    } };
})();
