import DepositBoxIncomeCashReportForm from "../components/reports/deposit-box/DepositBoxIncomeCashReportForm";
import DepositBoxOutcomeCashReportForm from "../components/reports/deposit-box/DepositBoxOutcomeCashReportForm";
import DepositBoxOutcomeDeliveryReportForm from "../components/reports/deposit-box/DepositBoxOutcomeDeliveryReportForm";
import DepositorIncomeCashReportForm from "../components/reports/depositor/DepositorIncomeCashReportForm";
import DepositorOutcomeDeliveryReportForm from "../components/reports/depositor/DepositorOutcomeDeliveryReportForm";
import DepositorOutcomeSupplierReportForm from "../components/reports/depositor/DepositorOutcomeSupplierReportForm";
import DepositorOutcomeWalletReportForm from "../components/reports/depositor/DepositorOutcomeWalletReportForm";
import IncomeWalletReportForm from "../components/reports/income/IncomeWalletReportForm";
import ReceivedHelpReportForm from "../components/reports/income/ReceivedHelpReportForm";
import SupplierReportForm from "../components/reports/income/SupplierReportForm";
import TypeOneDraftReportForm from "../components/reports/income/TypeOneDraftReportForm";
import TypeOneIncomeWalletCashReportForm from "../components/reports/income/TypeOneIncomeWalletCashReportForm";
import TypeOneIncomeWalletTransferenceReportForm from "../components/reports/income/TypeOneIncomeWalletTransferenceReportForm";
import TypeOneWalletReportForm from "../components/reports/income/TypeOneWalletReportForm";
import TypeTwoCashReportForm from "../components/reports/income/TypeTwoCashReportForm";
import TypeTwoHelpReportForm from "../components/reports/income/TypeTwoHelpReportForm";
import TypeTwoIncomeTransferenceReportForm from "../components/reports/income/TypeTwoIncomeTransferenceReportForm";
import TypeTwoIncomeWalletAccountReportForm from "../components/reports/income/TypeTwoIncomeWalletAccountReportForm";
import TypeTwoTransferReportForm from "../components/reports/income/TypeTwoTransferReportForm";
import WalletBossReportForm from "../components/reports/income/WalletBossReportForm";
import CreditReportForm from "../components/reports/outcome/CreditReportForm";
import OtherReportForm from "../components/reports/outcome/OtherReportForm";
import PayrollReportForm from "../components/reports/outcome/PayrollReportForm";
import RefillReportForm from "../components/reports/outcome/RefillReportForm";
import SendedHelpReportForm from "../components/reports/outcome/SendedHelpReportForm";
import StoreReportForm from "../components/reports/outcome/StoreReportForm";
import TaxDraftReportForm from "../components/reports/outcome/TaxDraftReportForm";
import TaxReportForm from "../components/reports/outcome/TaxReportForm";
import TypeOneOutcomeWalletCashReportForm from "../components/reports/outcome/TypeOneOutcomeWalletCashReportForm";
import TypeOneOutcomeWalletTransferenceReportForm from "../components/reports/outcome/TypeOneOutcomeWalletTransferenceReportForm";
import TypeTwoCashDeliveryReportForm from "../components/reports/outcome/TypeTwoCashDeliveryReportForm";
import TypeTwoDepositReportForm from "../components/reports/outcome/TypeTwoDepositReportForm";
import TypeTwoOutcomeTransferenceReportForm from "../components/reports/outcome/TypeTwoOutcomeTransferenceReportForm";
import TypeTwoWalletAccountReportForm from "../components/reports/outcome/TypeTwoWalletAccountReportForm";
import TypeTwoWalletAccountTransferenceForm from "../components/reports/outcome/TypeTwoWalletAccountTransferenceForm";
import OutcomeWalletReportForm from "../components/reports/outcome/WalletReportForm";
import SupplierOutcomeReportForm from "../components/reports/supplier/SupplierOutcomeReportForm";

const componentsMap = new Map();

/* VZLA */

// Income
componentsMap.set(1, <SupplierReportForm />);
componentsMap.set(2, <ReceivedHelpReportForm />);
componentsMap.set(3, <IncomeWalletReportForm />);

// Expense
componentsMap.set(4, <StoreReportForm />);
componentsMap.set(5, <OutcomeWalletReportForm />);
componentsMap.set(6, <SendedHelpReportForm />);
componentsMap.set(7, <TypeTwoTransferReportForm />);
componentsMap.set(8, <RefillReportForm />);
componentsMap.set(9, <TaxReportForm />);
componentsMap.set(10, <CreditReportForm />);
componentsMap.set(11, <OtherReportForm />);

/* International R2 */

// Income
componentsMap.set(12, <TypeTwoIncomeWalletAccountReportForm />);
componentsMap.set(13, <TypeTwoCashReportForm />);
componentsMap.set(14, <TypeTwoIncomeTransferenceReportForm />);
componentsMap.set(15, <TypeTwoHelpReportForm />);
componentsMap.set(16, <TypeTwoTransferReportForm />);

// Expense
componentsMap.set(17, <TypeTwoCashDeliveryReportForm />);
componentsMap.set(18, <TypeTwoWalletAccountReportForm />);
componentsMap.set(36, <TypeTwoWalletAccountTransferenceForm />);
componentsMap.set(25, <TypeTwoHelpReportForm />);
componentsMap.set(34, <TypeTwoDepositReportForm />);
componentsMap.set(35, <TypeTwoOutcomeTransferenceReportForm />);
componentsMap.set(19, <TaxReportForm />);
componentsMap.set(20, <CreditReportForm />);
componentsMap.set(21, <OtherReportForm />);
componentsMap.set(37, <PayrollReportForm />);
componentsMap.set(38, <TaxDraftReportForm />);

/* International R1 */
componentsMap.set(22, <TypeOneWalletReportForm />);
componentsMap.set(23, <TypeOneDraftReportForm />);
componentsMap.set(39, <WalletBossReportForm />);
componentsMap.set(40, <TypeOneIncomeWalletTransferenceReportForm />);
componentsMap.set(41, <TypeOneIncomeWalletCashReportForm />);
componentsMap.set(42, <TypeOneOutcomeWalletTransferenceReportForm />);
componentsMap.set(43, <TypeOneOutcomeWalletCashReportForm />);

/* Depositor */

// Income
componentsMap.set(27, <DepositorIncomeCashReportForm />);

// Expense
componentsMap.set(28, <DepositorOutcomeWalletReportForm />);
componentsMap.set(29, <DepositorOutcomeSupplierReportForm />);
componentsMap.set(30, <DepositorOutcomeDeliveryReportForm />);

/* Deposit Box */

// Income
componentsMap.set(31, <DepositBoxIncomeCashReportForm />);

// Expense
componentsMap.set(32, <DepositBoxOutcomeCashReportForm />);
componentsMap.set(33, <DepositBoxOutcomeDeliveryReportForm />);

/* Supplier */

// Expense
componentsMap.set(26, <SupplierOutcomeReportForm />);

export default componentsMap;
