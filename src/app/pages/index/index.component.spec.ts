import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { IndexComponent } from './index.component'

describe('IndexComponent', () => {
    let component: IndexComponent
    let fixture: ComponentFixture<IndexComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [IndexComponent]
        })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(IndexComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('Should create component', () => {

        expect(component).toBeTruthy()

    })

    test('Should contains about route page', () => {

        const wrapper: HTMLElement = fixture.debugElement.nativeElement

        const aboutRouteLink = wrapper.querySelector("[data-test=about-router-link]")

        expect(aboutRouteLink.getAttribute('ng-reflect-router-link')).toBe('/about')

    })

    test('Should contains docs route page', () => {

        const wrapper: HTMLElement = fixture.debugElement.nativeElement

        const aboutRouteLink = wrapper.querySelector("[data-test=docs-router-link]")

        expect(aboutRouteLink.getAttribute('ng-reflect-router-link')).toBe('https://github.com/thdq/ng-task-studio')

    })

    test('Should contains my todo route page', () => {

        const wrapper: HTMLElement = fixture.debugElement.nativeElement

        const aboutRouteLink = wrapper.querySelector("[data-test=todo-router-link]")

        expect(aboutRouteLink.getAttribute('ng-reflect-router-link')).toBe('/my-todo')

    })

})
