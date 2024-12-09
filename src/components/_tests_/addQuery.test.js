import {render, screen} from '@testing-library/react';
import AddQuery from '../addQuery';
import userEvent from '@testing-library/user-event';

describe('AddQuery', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(<AddQuery onSave={mockOnSave} onClose={mockOnClose} />);
  });

  it('should render form fields', () => {
    // Check if all form elements are rendered
    expect(screen.getByLabelText('Enter Query Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose Interval')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose API')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    // Fill form fields
    const queryNameInput = screen.getByLabelText('Enter Query Name');
    const intervalSelect = screen.getByLabelText('Choose Interval');
    const apiSelect = screen.getByLabelText('Choose API');

    await userEvent.type(queryNameInput, 'Test Query');
    await userEvent.selectOptions(intervalSelect, '1');
    await userEvent.selectOptions(apiSelect, 'bookSearch');

    // Now the parameter fields should be visible
    const parameterSelect = screen.getByLabelText('Parameter Name');
    const parameterValueInput = screen.getByLabelText('Parameter Value');

    await userEvent.selectOptions(parameterSelect, 'title');
    await userEvent.type(parameterValueInput, '1984');
    await userEvent.click(screen.getByText('Add Parameter'));

    // Select response attributes (multiple select)
    const responseSelect = screen.getByLabelText('Choose Response Attributes');
    await userEvent.selectOptions(responseSelect, ['Title', 'Author']);

    // Submit form
    await userEvent.click(screen.getByText('Save'));

    // Verify onSave was called with correct data
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        queryName: 'Test Query',
        interval: '1',
        api: 'bookSearch',
        parameters: [{ name: 'title', value: '1984' }],
        responseAttributes: ['Title', 'Author']
      })
    );
  });

  it('should handle parameter removal', async () => {
    // Add a parameter
    await userEvent.selectOptions(screen.getByLabelText('Choose API'), 'bookSearch');
    await userEvent.selectOptions(screen.getByLabelText('Parameter Name'), 'title');
    await userEvent.type(screen.getByLabelText('Parameter Value'), '1984');
    await userEvent.click(screen.getByText('Add Parameter'));

    // Verify parameter is added
    expect(screen.getByText('title: 1984')).toBeInTheDocument();

    // Remove parameter
    await userEvent.click(screen.getByText('Remove'));

    // Verify parameter is removed
    expect(screen.queryByText('title: 1984')).not.toBeInTheDocument();
  });
});