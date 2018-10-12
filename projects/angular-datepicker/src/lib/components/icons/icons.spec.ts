import { ICON_COMPONENTS } from '.';
import { TestBed } from '@angular/core/testing';


for (let i = 0; i < ICON_COMPONENTS.length; i++) {
    const type = ICON_COMPONENTS[i];

    describe(type.name, () => {
        it ('can be created', async () => {
            await TestBed.configureTestingModule({
                declarations: [type],
            }).compileComponents();
            const fixture = TestBed.createComponent(type);
            const component = fixture.componentInstance;
            fixture.detectChanges();
            expect(component).toBeTruthy();
        });
    });
}
