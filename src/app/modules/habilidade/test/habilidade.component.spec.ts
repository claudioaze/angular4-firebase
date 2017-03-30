import { Observable } from 'rxjs/Rx';
import { By } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { Habilidade } from './../habilidade.model';
import { HabilidadeService } from './../habilidade.service';
import { AppRoutingModule } from './../../../app.routing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';

import { HabilidadeModule } from './../habilidade.module';
import { HabilidadeComponent } from './../habilidade.component';

fdescribe('HabilidadeComponent', () => {
  let component: HabilidadeComponent;
  let fixture: ComponentFixture<HabilidadeComponent>;
  let habilidadeService: any;

  beforeEach(async(() => {

    habilidadeService = jasmine.createSpyObj(
      'habilidadeService', ['postHabilidade', 'getHabilidades', 'patchHabilidade', 'deleteHabilidade']);

    habilidadeService.getHabilidades.and.callFake(() => Promise.resolve([{ codigo: '1', nome: 'Força' }]));
    habilidadeService.postHabilidade.and.callFake(() => Promise.resolve({}));
    habilidadeService.patchHabilidade.and.callFake(() => Promise.resolve({}));
    habilidadeService.deleteHabilidade.and.callFake(() => Promise.resolve({}));

    TestBed.configureTestingModule({
      imports: [HabilidadeModule, HttpModule, AppRoutingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: HabilidadeService, useValue: habilidadeService }
      ]
    });

    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HabilidadeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have habilidade value', () => {
    const habilidade: Habilidade = { codigo: null, nome: 'Força' };
    fixture.componentInstance.form.patchValue(habilidade);
    fixture.detectChanges();

    const codigoHabilidade: string = fixture.componentInstance.form.get('codigo').value;
    const nomeHabilidade: string = fixture.componentInstance.form.get('nome').value;
    expect(codigoHabilidade).toBeNull('should be null');
    expect(nomeHabilidade).toEqual('Força', 'should be equals "Força"');
  });

  it('button salvar should be disabled', () => {
    const habilidade: Habilidade = { codigo: null, nome: null };
    fixture.componentInstance.form.patchValue(habilidade);
    fixture.detectChanges();

    const salvar: HTMLButtonElement = fixture.debugElement.query(By.css('#btnSalvar')).nativeElement;
    expect(salvar.disabled).toBeTruthy('should be disabled because form is invalid');

  });

  it('should save a new habilidade', (done) => {
    const habilidade: Habilidade = { codigo: null, nome: 'Força' };
    fixture.componentInstance.form.patchValue(habilidade);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const salvar: HTMLButtonElement = fixture.debugElement.query(By.css('#btnSalvar')).nativeElement;
      salvar.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(habilidadeService.postHabilidade).toHaveBeenCalled();
        done();
      });
    });
  });

  it('should patch habilidade', (done) => {
    const habilidade: Habilidade = { codigo: '1', nome: 'Força' };
    fixture.componentInstance.form.patchValue(habilidade);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const salvar: HTMLButtonElement = fixture.debugElement.query(By.css('#btnSalvar')).nativeElement;
      salvar.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(habilidadeService.patchHabilidade).toHaveBeenCalled();
        done();
      });
    });
  });

  it('deve haver 1 item na lista', (done) => {

    expect(habilidadeService.getHabilidades).toHaveBeenCalledTimes(1);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.habilidades.length).toBe(1);
      done();
    });
  });

  it('deve haver 2 itens na lista <table>', (done) => {
    const lista: HTMLTableElement = fixture.debugElement.query(By.css('table#lista')).nativeElement;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(lista.rows.length).toBe(2, 'deve haver pelos menos 2 linhas'); //incluindo a linha do header
      done();
    });
  });

  it('should show edit and delete buttons', (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const editButton: HTMLButtonElement = fixture.debugElement.query(By.css('#btnEdit')).nativeElement;
      const deleteButton: HTMLButtonElement = fixture.debugElement.query(By.css('#btnDelete')).nativeElement;
      expect(editButton).toBeDefined('edit button should be defined');
      expect(deleteButton).toBeDefined('delete button should be defined');
      done();
    });
  });

});
