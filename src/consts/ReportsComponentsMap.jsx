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
componentsMap.set(0, <SupplierReportForm />);
componentsMap.set(0, <ReceivedHelpReportForm />)
componentsMap.set(3, <IncomeWalletReportForm />)
componentsMap.set(0, <TypeOneWalletReportForm />)
componentsMap.set(2, <TypeOneDraftReportForm />)
componentsMap.set(0, <TypeTwoIncomeWalletAccountReportForm />)
componentsMap.set(0, <TypeTwoCashReportForm />)
componentsMap.set(0, <TypeTwoIncomeTransferenceReportForm />)
componentsMap.set(0, <TypeTwoHelpReportForm />)
componentsMap.set(0, <TypeTwoTransferReportForm />)
componentsMap.set(0, <StoreReportForm />)
componentsMap.set(0, <OutcomeWalletReportForm />)
componentsMap.set(0, <SendedHelpReportForm />)
componentsMap.set(0, <TypeTwoTransferReportForm />)
// componentsMap.set(8, <TransferReportForm />)
componentsMap.set(0, <RefillReportForm />)
componentsMap.set(0, <TaxReportForm />)
componentsMap.set(0, <CreditReportForm />)
componentsMap.set(0, <OtherReportForm />)
componentsMap.set(1, <TypeTwoWalletAccountReportForm />)
componentsMap.set(0, <TypeTwoCashDeliveryReportForm />)
componentsMap.set(0, <TypeTwoDepositReportForm />)
componentsMap.set(0, <TypeTwoOutcomeTransferenceReportForm />)
componentsMap.set(111, <TaxReportForm />)
componentsMap.set(112, <CreditReportForm />)
componentsMap.set(113, <OtherReportForm />)

export default componentsMap;