import { clientConfigService } from './v4/services/clientConfig';

if (clientConfigService.isMaintenanceEnabled) {
	document.getElementById('maintenanceMode').style.display = 'block';
	document.getElementById('app').style.display = 'none';
}
