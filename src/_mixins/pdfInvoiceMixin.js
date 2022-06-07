import { billingsService } from "@/_services";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
export const pdfInvoiceMixin = {
  methods: {
    downloadPDF(payment) {
      billingsService.downloadPDF(payment.id).then(result => {
        const pdf = new jsPDF('p', 'pt', [595.28, 841.89]);
        var imgData = "data:image/png;base64,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";
        pdf.addImage(imgData, 'JPEG', 40, 15, 100, 99);
        pdf.setFontSize(26);
        pdf.setTextColor(81, 85, 236);
        pdf.text(465, 40, 'OLIVER');

        pdf.setFontSize(9);
        pdf.setTextColor(150);
        pdf.text(500, 60, 'AIVONI SAS');
        pdf.text(493, 72, '9 rue Bartholdi');
        pdf.text(442, 84, '92100 Boulogne Billancourt');
        pdf.text(447, 96, 'N° Siret: 80878516600022');
        pdf.text(501, 108, 'NAF.: 6201Z');
        pdf.text(443, 120, 'TVA CEE: FR32808785166');

        pdf.setDrawColor(0);
        pdf.setFillColor(81, 85, 236);
        pdf.rect(0, 150, 250, 20, 'F');

        pdf.setFontSize(22);
        pdf.setFontType("bold");
        pdf.setTextColor(255);
        pdf.text(145, 167, 'INVOICE');

        pdf.setTextColor(100);

        let invoice = result.data;
        let d = new Date(payment.date);
        let year_digits = d.getFullYear().toString().substr(-2);
        let invoiceId = year_digits + 'OL' + invoice.invoice_id.toString().padStart(10, "0");
        pdf.setFontType("normal");
        pdf.setFontSize(11);
        pdf.text(40, 185, 'Invoice number: ' + invoiceId);

        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        let year = d.getFullYear().toString();
        pdf.text(40, 200, 'Invoice date: ' + d.getDay() + ' ' + monthNames[d.getMonth()] + ', ' + year);

        if (invoice.ingenico_pay_id != undefined) {
          pdf.text(40, 215, 'Billing id: ' + invoice.ingenico_pay_id);
        }

        let client = result.data;
        if (client.name) {
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(40, 230, 'Invoice to: ');
          pdf.setFontSize(10);
          pdf.setFontType("bold");
          pdf.text(40, 245, client.name);
          pdf.setFontType("normal");
          pdf.text(40, 260, client.legal_representative);
          pdf.text(40, 275, client.address);
          pdf.text(40, 290, client.country);
        }

        pdf.autoTableSetDefaults({
          headStyles: { fillColor: [81, 85, 236] }, // Purple
        })

        var data = result.data;

        var total = result.data.total;
        var discount_amount = result.data.discount_amount;
        var discount_previous_payment = result.data.discount_previous_payment;
        total = (total - discount_amount - discount_previous_payment).toFixed(2);
        var totalWithVat = result.data.total_with_vat;
        var totalVat = totalWithVat - total;
        totalVat = (Math.round(totalVat * 100) / 100).toFixed(2);

        var percentage = Math.trunc(totalVat * 100 / total);

        result.data.total = result.data.total + ' €';

        let discount = (result.data.discount * 100 / 100).toFixed(0);
        let discount_data = {};

        let discount_previous_payment_data = {};

        if (discount_previous_payment > 0) {
          discount_previous_payment_data = { date: "Prorata refund old plan", total: "- " + discount_previous_payment + ' €' };
        }

        if (discount > 0) {
          discount_data = { date: "Remise (" + discount + " %)", total: "- " + result.data.discount_amount + ' €' };
        }

        // var firstElement = data[0];
        // firstElement.date = billing.start_date + '  -  ' + billing.end_date ;
        pdf.autoTable({
          startY: 320,
          body: [data, discount_previous_payment_data, discount_data],
          columns: [
            { header: 'Date', dataKey: 'date' },
            { header: 'Description', dataKey: 'description' },
            // { header: 'Qty', dataKey: 'quantity' },
            // { header: 'Unit Price', dataKey: 'amount' },
            { header: 'Total in EUR', dataKey: 'total' },
          ],
          columnStyles: {
            2: { halign: 'right' }
          },
        })


        var body = [];
        body.push({ field: "Subtotal in EUR", value: total + ' €' });
        body.push({ field: "VAT (" + percentage + "%)", value: totalVat + ' €' });
        body.push({ field: "Total in EUR", value: totalWithVat + ' €' });
        pdf.autoTable({
          startY: pdf.lastAutoTable.finalY + 40,
          tableWidth: 200,
          theme: 'grid',
          minCellHeight: 30,
          margin: { left: 350 },
          head: [{ field: '', value: '' },],
          body: body,
          showHead: false,
          columnStyles: {
            field: { fontStyle: 'bold', cellPadding: 7 },
            value: { cellPadding: 7, halign: 'right' }
          },
        })

        //pdf.setFontType("bold");
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(40, pdf.lastAutoTable.finalY + 40, 'The invoice was generated electronically and automatically, without a cash register.');
        pdf.text(40, pdf.lastAutoTable.finalY + 60, 'This is the original electronic version.');
        pdf.text(40, pdf.lastAutoTable.finalY + 80, 'Services subject to the reverse change - VAT to be accounted for by the recepient as per Article 196');
        pdf.text(40, pdf.lastAutoTable.finalY + 90, 'of council Directice 2006/112/EC');

        pdf.save('invoice-' + invoiceId + '.pdf');
      }
      );
    }
  }
}