import IncomeWalletReportForm from "../components/reports/income/IncomeWalletReportForm";
import ReceivedHelpReportForm from "../components/reports/income/ReceivedHelpReportForm";
import SupplierReportForm from "../components/reports/income/SupplierReportForm";
import TypeOneDraftReportForm from "../components/reports/income/TypeOneDraftReportForm";
import TypeOneWalletReportForm from "../components/reports/income/TypeOneWalletReportForm";
import TypeTwoCashReportForm from "../components/reports/income/TypeTwoCashReportForm";
import TypeTwoHelpReportForm from "../components/reports/income/TypeTwoHelpReportForm";
import TypeTwoIncomeTransferenceReportForm from "../components/reports/income/TypeTwoIncomeTransferenceReportForm";
import TypeTwoIncomeWalletAccountReportForm from "../components/reports/income/TypeTwoIncomeWalletAccountReportForm";
import TypeTwoTransferReportForm from "../components/reports/income/TypeTwoTransferReportForm";
import CreditReportForm from "../components/reports/outcome/CreditReportForm";
import OtherReportForm from "../components/reports/outcome/OtherReportForm";
import RefillReportForm from "../components/reports/outcome/RefillReportForm";
import SendedHelpReportForm from "../components/reports/outcome/SendedHelpReportForm";
import StoreReportForm from "../components/reports/outcome/StoreReportForm";
import TaxReportForm from "../components/reports/outcome/TaxReportForm";
import TypeTwoCashDeliveryReportForm from "../components/reports/outcome/TypeTwoCashDeliveryReportForm";
import TypeTwoDepositReportForm from "../components/reports/outcome/TypeTwoDepositReportForm";
import TypeTwoOutcomeTransferenceReportForm from "../components/reports/outcome/TypeTwoOutcomeTransferenceReportForm";
import TypeTwoWalletAccountReportForm from "../components/reports/outcome/TypeTwoWalletAccountReportForm";
import OutcomeWalletReportForm from "../components/reports/outcome/WalletReportForm";

const componentsMap = new Map();

/* VZLA */

// Income
componentsMap.set(1, <SupplierReportForm />);
componentsMap.set(2, <ReceivedHelpReportForm />)
componentsMap.set(3, <IncomeWalletReportForm />)

// Expense
componentsMap.set(4, <StoreReportForm />)
componentsMap.set(5, <OutcomeWalletReportForm />)
componentsMap.set(6, <SendedHelpReportForm />)
componentsMap.set(7, <TypeTwoTransferReportForm />)
componentsMap.set(8, <RefillReportForm />)
componentsMap.set(9, <TaxReportForm />)
componentsMap.set(10, <CreditReportForm />)
componentsMap.set(11, <OtherReportForm />)

/* International R2 */

// Income
componentsMap.set(12, <TypeTwoIncomeWalletAccountReportForm />)
componentsMap.set(13, <TypeTwoCashReportForm />)
componentsMap.set(14, <TypeTwoIncomeTransferenceReportForm />)
componentsMap.set(15, <TypeTwoHelpReportForm />)
componentsMap.set(16, <TypeTwoTransferReportForm />)

// Expense
componentsMap.set(17, <TypeTwoCashDeliveryReportForm />)
componentsMap.set(18, <TypeTwoWalletAccountReportForm />)
componentsMap.set(19, <TaxReportForm />)
componentsMap.set(20, <CreditReportForm />)
componentsMap.set(21, <OtherReportForm />)

/* International R1 */
componentsMap.set(22, <TypeOneWalletReportForm />)
componentsMap.set(23, <TypeOneDraftReportForm />)

// componentsMap.set(0, <TypeTwoDepositReportForm />)
// componentsMap.set(0, <TypeTwoOutcomeTransferenceReportForm />)

export default componentsMap;