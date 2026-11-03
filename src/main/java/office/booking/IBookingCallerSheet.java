package office.booking;

/**
 * Sheet name of the booking domain's caller sheet: the sheet whose store holds the Room and Booking rows, and
 * from which every booking entity sheet reads its caller session ({@code @Sheet(callerSheet = ...)}).
 */
@SuppressWarnings("PMD.ConstantsInInterface")
public interface IBookingCallerSheet {

    /** The booking caller sheet name. */
    String NAME = "office.booking.context.Caller";
}
