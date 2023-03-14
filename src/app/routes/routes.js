// import HomePage from 'app/pages/HomePage';
import LoginPage from "app/pages/LoginPage";
import PageNotFound from "app/pages/PageNotFound";
import LandingPage from "app/pages/LandingPage";
import AppLayout from "app/layout/AppLayout";
import SubjectPage from "infection-chain/pages/SubjectPage";
import CreateSubjectPage from "infection-chain/pages/CreateSubjectPage";
import DashboardPage from "dashboard/pages/DashboardPage";
import ContactLocationPage from "contact/pages/ContactLocationPage";
import ContactVehiclePage from "contact/pages/ContactVehiclePage";
import GraphPage from "dashboard/pages/GraphPage";
import MedicalTestPage from "medical-test/pages/MedicalTestPage";
import QuarantineZonePage from "quarantine/pages/QuarantineZonePage";
import ContactLocationDetail from "contact/pages/ContactLocationDetail";
import ContactVehicleDetail from "contact/pages/ContactVehicleDetail";
import PDFPreviewPage from "pdf/pages/PDFPreviewPage";
import ReportPage from "report/pages/ReportPage";
import ChangePasswordPage from "app/pages/ChangePasswordPage";
import InfoPage from "app/pages/InfoPage";
import MedicalTestZonePage from "medical-test/pages/MedicalTestZonePage";
import QuarantineWaitingSubjectPage from "quarantine/pages/QuarantineWaitingSubjectPage";
import QuarantineSubjectPage from "quarantine/pages/QuarantineSubjectPage";
import UnitPage from "medical-test/pages/UnitPage";
import CodePage from "medical-test/pages/CodePage";
import AssigneePage from "medical-test/pages/AssigneePage";
import ExaminationPage from "medical-test/pages/ExaminationPage";
import TransportPage from "medical-test/pages/TransportPage";
import SessionPage from "medical-test/pages/SessionPage";
import QuarantineFacilityPage from "quarantine/pages/QuarantineFacilityPage";
import ProfilePage from "profile/pages/ProfilePage";
import QuarantineRequestPage from "quarantine/pages/QuarantineRequestPage";
import ProfileDetailPage from "profile/pages/ProfileDetailPage";
import CompletedSubjectPage from "quarantine/pages/CompletedSubjectPage";
import FacilityListPage from "quarantine-facilities/pages/FacilityListPage";
import FacilityInfoPage from "quarantine-facilities/pages/FacilityInfoPage";
import WaitingListPage from "quarantine-facilities/pages/WaitingListPage";
import InQuarantinePage from "quarantine-facilities/pages/InQuarantinePage";
import InHomePage from "quarantine-facilities/pages/InHomePage";
import CompletedPage from "quarantine-facilities/pages/CompletedPage";
import FormPage from "quarantine-facilities/pages/FormPage";
import GeneralPage from "general/pages/GeneralListPage";
import ChainPage from "chain/pages/ChainPage";
import ChainDetailPage from "chain/pages/ChainDetailPage";
import EstatePage from "contact/pages/EstatePage";
import VehiclePage from "contact/pages/VehiclePage";
import AirplanePage from "contact/pages/AirplanePage";
import FacilityStatisticPage from "quarantine-facilities/pages/FacilityStatisticPage";
import UnverifiedSubjectPage from "infection-chain/pages/UnverifiedSubjectPage";
import CollectingSessionPage from "medical-test/components/collecting-session/pages/CollectingSessionPage";
import PositiveExaminationPage from "medical-test/pages/PositiveExamPage";
import TMWaitingForTreatmentPage from "treatment/pages/WaitingForTreatmentPage";
import TMWaitingToTakePage from "treatment/pages/WaitingToTakePage";
import TMTakenPage from "treatment/pages/TakenPage";
import TMTransferedPage from "treatment/pages/TransitedPage";
import TMOutOfProcessPage from "treatment/pages/OutOfProcessPage";
import TMCompletedPage from "treatment/pages/CompletedPage";
import TMFacilityPage from "treatment/pages/FacilityPage";
import TMHospitalPage from "treatment/pages/HospitalPage";
import TMEmployeePage from "treatment/pages/EmployeePage";
import HomePage from "home/pages/HomePage";
import TMTransferPage from "treatment/pages/TransferPage";
import QuickTestPage from "medical-test/pages/QuickTestPage";
import PositiveQuickTestPage from "medical-test/pages/PositiveQuickTestPage";
import InfectiousDiseasePage from "profile/pages/InfectiousDiseasePage";
import PatientManagementPage from "patient-management/pages/PatientManagementPage";
import TotalPatientManagementPage from "patient-management/pages/TotalInfectedPatientTable";
import InfectedPatientDetailPage from "patient-management/pages/InfectedPatientDetailPage";
import ProfileTrain from "profile-train/pages/ProfilePage";
import ProfileDetailPages from "profile-train/pages/ProfileDetailPages";
const routes = [
  {
    path: "/",
    component: LandingPage,
    layout: null,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/auth",
    component: LandingPage,
    layout: null,
    isPrivate: false,
    exact: false,
  },
  {
    path: "/login",
    component: LoginPage,
    layout: null,
    isPrivate: false,
    exact: false,
  },
  {
    path: "/home",
    component: HomePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/info",
    component: InfoPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/change-password",
    component: ChangePasswordPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/general",
    component: GeneralPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/subject",
    component: SubjectPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/unverified-subject",
    component: UnverifiedSubjectPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/profile/:id/:tab/:chainId",
    component: ProfileDetailPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/profile/:id/:tab",
    component: ProfileDetailPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/profile/:id",
    component: ProfileDetailPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/create-subject",
    component: CreateSubjectPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/dashboard",
    component: DashboardPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/vehicle",
    component: VehiclePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/airplane",
    component: AirplanePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/estate",
    component: EstatePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/contact-location/:id",
    component: ContactLocationDetail,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/contact-location",
    component: ContactLocationPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/contact-vehicle/:id",
    component: ContactVehicleDetail,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/contact-vehicle",
    component: ContactVehiclePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/medical-test",
    component: MedicalTestPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/medical-test-zone",
    component: MedicalTestZonePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/unit",
    component: UnitPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/code",
    component: CodePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/assign",
    component: AssigneePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/examination",
    component: ExaminationPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/quarantine-zone",
    component: QuarantineZonePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/quarantine-waiting-subject",
    component: QuarantineWaitingSubjectPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/quarantine-subject",
    component: QuarantineSubjectPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/graph/:id",
    component: GraphPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/graph",
    component: GraphPage,
    layout: null,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/pdf/:id",
    component: PDFPreviewPage,
    layout: null,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/pdf",
    component: PDFPreviewPage,
    layout: null,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/report",
    component: ReportPage,
    layout: null,
    isPrivate: false,
    exact: false,
  },
  {
    path: "/transport",
    component: TransportPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/test-session",
    component: SessionPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/quarantine-facilities",
    component: QuarantineFacilityPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facilities",
    component: FacilityListPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facility-info",
    component: FacilityInfoPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facilities-waiting-list",
    component: WaitingListPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facilities-form",
    component: FormPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facilities-in-quarantine",
    component: InQuarantinePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/home-waiting-list",
    component: InHomePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/home-in-quarantine",
    component: InHomePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/home-completed",
    component: InHomePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facilities-completed",
    component: CompletedPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/quarantine-request",
    component: QuarantineRequestPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/completed-subject",
    component: CompletedSubjectPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/facility-statistic",
    component: FacilityStatisticPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/chain/:id",
    component: ChainDetailPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/chain",
    component: ChainPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/collecting-session",
    component: CollectingSessionPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    exact: true,
    path: "/positive-examination",
    component: PositiveExaminationPage,
    layout: AppLayout,
    isPrivate: true,
  },
  {
    path: "/tm-facility",
    component: TMFacilityPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-waiting-for-treatment",
    component: TMWaitingForTreatmentPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-waiting-to-take",
    component: TMWaitingToTakePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-taken",
    component: TMTakenPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-transited",
    component: TMTransferedPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-completed",
    component: TMCompletedPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-out-of-process",
    component: TMOutOfProcessPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-hospital",
    component: TMHospitalPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-employee",
    component: TMEmployeePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/tm-transfer",
    component: TMTransferPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/quick-test",
    component: QuickTestPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/positive-quick-test",
    component: PositiveQuickTestPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/infectious-disease",
    component: InfectiousDiseasePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/infectious-disease1",
    component: InfectiousDiseasePage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/infected-patient",
    component: PatientManagementPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/infected-patient-detail/:id",
    component: InfectedPatientDetailPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/total-infected-patient",
    component: TotalPatientManagementPage,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/train/:id",
    component: ProfileDetailPages,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    path: "/train",
    component: ProfileTrain,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  // data reconciliation
  {
    path: "/test",
    component: ProfileTrain,
    layout: AppLayout,
    isPrivate: true,
    exact: false,
  },
  {
    component: PageNotFound,
    layout: null,
    isPrivate: false,
    exact: false,
  },
];

export default routes;
