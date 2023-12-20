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
componentsMap.set(1, <SupplierReportForm />)
componentsMap.set(2, <ReceivedHelpReportForm />)
componentsMap.set(3, <IncomeWalletReportForm />)
componentsMap.set(101, <TypeOneWalletReportForm />)
componentsMap.set(102, <TypeOneDraftReportForm />)
componentsMap.set(114, <TypeTwoIncomeWalletAccountReportForm />)
componentsMap.set(103, <TypeTwoCashReportForm />)
componentsMap.set(104, <TypeTwoIncomeTransferenceReportForm />)
componentsMap.set(105, <TypeTwoHelpReportForm />)
componentsMap.set(106, <TypeTwoTransferReportForm />)
componentsMap.set(5, <StoreReportForm />)
componentsMap.set(6, <OutcomeWalletReportForm />)
componentsMap.set(7, <SendedHelpReportForm />)
componentsMap.set(8, <TypeTwoTransferReportForm />)
// componentsMap.set(8, <TransferReportForm />)
componentsMap.set(9, <RefillReportForm />)
componentsMap.set(10, <TaxReportForm />)
componentsMap.set(11, <CreditReportForm />)
componentsMap.set(12, <OtherReportForm />)
componentsMap.set(107, <TypeTwoWalletAccountReportForm />)
componentsMap.set(108, <TypeTwoCashDeliveryReportForm />)
componentsMap.set(109, <TypeTwoDepositReportForm />)
componentsMap.set(110, <TypeTwoOutcomeTransferenceReportForm />)
componentsMap.set(111, <TaxReportForm />)
componentsMap.set(112, <CreditReportForm />)
componentsMap.set(113, <OtherReportForm />)

export default componentsMap;