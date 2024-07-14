import {Avatar}  from '@/components/Avatar';
import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import { getAvatar } from '@/actions/getUsers';


jest.mock('../actions/getUsers', () => ({
    getAvatar : jest.fn(),
}));



describe('Avatar Component Tests', () => {

    const MOCK_AVATAR = 'fake_url';

    it('renders a card with a successful avatar get', async() => {
        //@ts-ignore only exists at runtime
        getAvatar.mockImplementation(()=> MOCK_AVATAR);        
        render(await Avatar({name :'TEST'}));
        expect(screen.getByTestId('has-avatar')).toBeInTheDocument();
    })

    it('renders a the default with a failed or null avatar get', async() => {
        //@ts-ignore only exists at runtime
        getAvatar.mockImplementation(()=> null);        
        render(await Avatar({name :'TEST'}));
        expect(screen.getByTestId('no-avatar')).toBeInTheDocument();

    })
})