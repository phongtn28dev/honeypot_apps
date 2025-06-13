import CardContainer from '@/components/card-contianer/v3';
import StatCard from './components/stat-card';
import SelectionSection from './components/selection-section';
import AllInOneVaultTable from './components/all-in-one-vault-table';

export default function AllInOneVault() {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <CardContainer className="xl:max-w-[1200px]">
        <StatCard />
        <AllInOneVaultTable />
        <SelectionSection />
      </CardContainer>
    </div>
  );
}
