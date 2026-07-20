import type { Metadata } from "next";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { createMetadata } from "@/data/metadata";
import { breadcrumbSchema, webPageSchema } from "@/data/schema";

const policies = [
  ["Deposits", "A $50 deposit is required to secure all appointments and is applied toward your service or treatment total at your visit."],
  ["Cancellations & Rescheduling", "A minimum of 24 hours' notice is required for any appointment changes. Appointments canceled or rescheduled with less than 24 hours' notice will result in forfeiture of the deposit."],
  ["Arrival Time", "Please arrive 10 minutes early for paperwork and a prompt appointment start. Late arrivals may result in a shortened visit or require rescheduling."],
  ["Acknowledgment", "By booking an appointment, you acknowledge and agree to these policies. Velvet Couture Medspa may refuse future bookings for repeated cancellations or missed appointments."],
];

export const metadata: Metadata = createMetadata({
  title: "Appointment & Booking Policy",
  description: "Velvet Couture Medspa appointment deposits, cancellation, rescheduling, and arrival policy.",
  path: "/return-policy/",
});

export default function BookingPolicyPage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Booking Policy", url: "/return-policy/" }]),
          webPageSchema({
            url: "/return-policy/",
            name: "Appointment and Booking Policy",
            description: "Appointment deposits, cancellations, rescheduling, and arrival expectations.",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="eyebrow">Policy</div>
          <h1 className="mb-6">Appointment and booking policy.</h1>
          <p className="mb-10 max-w-3xl text-lg text-[var(--color-text-muted)]">
            Each appointment is reserved exclusively for you. These policies allow us to provide a seamless experience while respecting every client&apos;s scheduled time.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {policies.map(([title, body]) => (
              <article key={title} className="card p-6">
                <h2 className="mb-3 text-2xl">{title}</h2>
                <p className="text-[var(--color-text-muted)]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
