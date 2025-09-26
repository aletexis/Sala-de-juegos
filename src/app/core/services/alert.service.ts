import { Injectable } from '@angular/core';
import Swal, { SweetAlertPosition } from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	show(options: {
		title: string,
		text?: string,
		iconHtml?: string,
		imageUrl?: string,
		imageWidth?: number,
		imageHeight?: number,
		position?: SweetAlertPosition,
		background?: string,
		backdrop?: string,
		customClass?: any,
		timer?: number
	}) {
		Swal.fire({
			toast: true,
			position: options.position || 'bottom',
			showConfirmButton: false,
			timer: options.timer ?? 2000,
			timerProgressBar: true,
			title: options.title,
			text: options.text,
			iconHtml: options.iconHtml,
			imageUrl: options.imageUrl,
			imageWidth: options.imageWidth,
			imageHeight: options.imageHeight,
			background: options.background || '#323B48',
			color: '#f5f5f5',
			backdrop: options.backdrop || undefined,
			customClass: options.customClass || {
				popup: 'custom-toast animate__animated animate__fadeInUp animate__faster'
			},
			didOpen: (toast) => {
				toast.addEventListener('mouseenter', Swal.stopTimer);
				toast.addEventListener('mouseleave', Swal.resumeTimer);
			}
		});
	}

	success(title: string) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-check-circle" style="color:#01A25F;font-size:1.4rem"></i>'
		});
	}

	error(title: string) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-times-circle" style="color:#F55376;font-size:1.4rem"></i>'
		});
	}

	info(title: string) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-info-circle" style="color:#00AACC;font-size:1.4rem"></i>'
		});
	}

	warning(title: string) {
		this.show({
			title,
			iconHtml: '<i class="fas fa-exclamation-triangle" style="color:#F5BC00;font-size:1.4rem"></i>'
		});
	}
}