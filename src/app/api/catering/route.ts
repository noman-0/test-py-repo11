import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phoneNumber,
      email,
      eventType,
      eventDate,
      eventTime,
      guestCount,
      selectedPackages,
      dohaNeighborhood,
      specialRequests,
    } = body;

    // Validate essential inputs
    if (!fullName || !phoneNumber || !eventDate || !dohaNeighborhood) {
      return NextResponse.json(
        { error: "Missing required booking details (Name, Phone, Date, or Neighborhood)." },
        { status: 400 }
      );
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/[\s-]/g, "");

    // Prepare internal log summary
    console.log("=== NEW EXCELSA EVENT CATERING BOOKING ===");
    console.log(`Customer: ${fullName} (${cleanPhone})`);
    console.log(`Email: ${email || "N/A"}`);
    console.log(`Event: ${eventType} on ${eventDate} at ${eventTime || "TBD"}`);
    console.log(`Guests: ~${guestCount}`);
    console.log(`Neighborhood: ${dohaNeighborhood}`);
    console.log(`Packages:`, selectedPackages);
    console.log(`Notes: ${specialRequests || "None"}`);

    // If RESEND_API_KEY is configured in runtime environment, dispatch email via Resend REST API
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Excelsa Inquiries <catering@excelsacafe.qa>",
            to: ["ahamad@excelsacafe.qa", "operations@excelsacafe.qa"],
            subject: `Catering Booking: ${fullName} (${guestCount} Guests - ${dohaNeighborhood})`,
            html: `
              <div style="font-family: sans-serif; background-color: #072B29; color: #FEFADD; padding: 32px; border-radius: 12px;">
                <h2 style="color: #FEFADD; margin-top: 0;">Excelsa Event Catering Request</h2>
                <p><strong>Customer Name:</strong> ${fullName}</p>
                <p><strong>Phone:</strong> <a href="tel:${cleanPhone}" style="color: #C8A96A;">${cleanPhone}</a></p>
                <p><strong>Email:</strong> ${email || "N/A"}</p>
                <hr style="border-color: #0E3F3C;" />
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Date & Time:</strong> ${eventDate} at ${eventTime || "TBD"}</p>
                <p><strong>Estimated Guests:</strong> ${guestCount}</p>
                <p><strong>Doha Neighborhood:</strong> ${dohaNeighborhood}</p>
                <h3>Selected Items:</h3>
                <ul>
                  ${(selectedPackages || [])
                    .map(
                      (pkg: any) =>
                        `<li>${pkg.quantity}x ${pkg.packageName} (${pkg.quantity * pkg.unitPriceQAR} QAR)</li>`
                    )
                    .join("")}
                </ul>
                ${specialRequests ? `<p><strong>Special Notes:</strong> ${specialRequests}</p>` : ""}
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn("Resend email dispatch skipped or errored:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking inquiry logged successfully.",
      referenceId: `EXC-${Date.now().toString().slice(-6)}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
